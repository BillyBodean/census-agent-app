const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const { isWorkflowId } = require('./chatkit');
const workflowId = process.env.OPENAI_WORKFLOW_ID || process.env.OPENAI_AGENT_ID;
const agentId = process.env.OPENAI_AGENT_ID;

function isAssistantId(id) {
  return typeof id === 'string' && id.startsWith('asst_');
}

async function runThreadWithAgent(question, agentOrWorkflowId, options = {}) {
  const thread = await openai.beta.threads.create();
  await openai.beta.threads.messages.create(thread.id, {
    role: 'user',
    content: question,
  });
  const runOptions = { assistant_id: agentOrWorkflowId };
  if (options.model) runOptions.model = options.model;
  const run = await openai.beta.threads.runs.createAndPoll(thread.id, runOptions);
  if (run.status !== 'completed') {
    const err = new Error(`Run ended with status: ${run.status}`);
    err.status = 500;
    err.runStatus = run.status;
    throw err;
  }
  const { data: messages } = await openai.beta.threads.messages.list(thread.id, {
    order: 'desc',
    limit: 1,
  });
  const msg = messages && messages[0];
  if (!msg || msg.role !== 'assistant') {
    throw new Error('No assistant reply returned');
  }
  const parts = (msg.content || []).filter((p) => p.type === 'text');
  const text = parts.map((p) => p.text?.value ?? '').filter(Boolean).join('\n');
  return text || '(No text in response.)';
}

async function askWithAssistantsAPI(question) {
  return runThreadWithAgent(question, agentId);
}

async function askWithWorkflowAPI(question, wfId) {
  const model = process.env.OPENAI_MODEL || 'gpt-4.1';
  return runThreadWithAgent(question, wfId, { model });
}

async function askWithResponsesAPI(question) {
  const run = await openai.responses.create({
    model: 'gpt-4o',
    input: question,
  });
  return run.output_text ?? '';
}

router.post('/', async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    return res.status(400).json({ error: 'question is required and must be a non-empty string.' });
  }
  if (question.length > 1000) {
    return res.status(400).json({ error: 'question must be 1000 characters or fewer.' });
  }

  const id = workflowId || agentId;
  if (!id?.trim()) {
    return res.status(500).json({ error: 'Server configuration error: OPENAI_AGENT_ID or OPENAI_WORKFLOW_ID is not set.' });
  }

  try {
    let answer;
    if (isWorkflowId(id)) {
      answer = await askWithWorkflowAPI(question.trim(), id);
    } else if (isAssistantId(agentId)) {
      answer = await askWithAssistantsAPI(question.trim());
    } else {
      answer = await askWithResponsesAPI(question.trim());
    }

    return res.json({ answer: answer || 'No answer generated.' });
  } catch (err) {
    const status = err.status ?? err.httpStatus ?? 500;
    const message = err.message || 'Unknown error';
    console.error('[OpenAI Error]', status, message, err.runStatus != null ? { runStatus: err.runStatus } : '');

    if (status === 429) {
      return res.status(429).json({ error: 'OpenAI rate limit reached. Try again shortly.' });
    }
    if (status === 401) {
      return res.status(500).json({ error: 'Server configuration error. Check OPENAI_API_KEY.' });
    }
    if (status === 404) {
      return res.status(500).json({ error: 'Workflow, assistant, or model not found. Check OPENAI_WORKFLOW_ID / OPENAI_AGENT_ID.' });
    }
    if (err.runStatus === 'failed' || err.runStatus === 'cancelled' || err.runStatus === 'expired') {
      return res.status(500).json({ error: `Request did not complete (${err.runStatus}). Please try again.` });
    }
    return res.status(500).json({
      error: 'Failed to get a response. Please try again. Check Railway logs for details.',
    });
  }
});

module.exports = router;
