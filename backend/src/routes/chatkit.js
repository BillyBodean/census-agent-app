const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const workflowId = process.env.OPENAI_WORKFLOW_ID || process.env.OPENAI_AGENT_ID;

function isWorkflowId(id) {
  return typeof id === 'string' && id.trim().length > 0 && id.startsWith('wf_');
}

router.post('/session', async (req, res) => {
  if (!isWorkflowId(workflowId)) {
    return res.status(500).json({
      error: 'Server is not configured with a workflow ID. Set OPENAI_WORKFLOW_ID or OPENAI_AGENT_ID to a wf_... value.',
    });
  }

  const user = req.body?.user || `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  try {
    const session = await openai.beta.chatkit.sessions.create({
      user,
      workflow: { id: workflowId.trim() },
    });
    return res.json({ client_secret: session.client_secret });
  } catch (err) {
    const status = err.status ?? err.httpStatus ?? 500;
    console.error('[ChatKit Session Error]', status, err.message);
    if (status === 401) {
      return res.status(500).json({ error: 'Server configuration error. Check OPENAI_API_KEY.' });
    }
    if (status === 404) {
      return res.status(500).json({ error: 'Workflow not found. Check OPENAI_WORKFLOW_ID.' });
    }
    return res.status(500).json({
      error: 'Failed to create chat session. Please try again.',
    });
  }
});

module.exports = router;
module.exports.isWorkflowId = isWorkflowId;
module.exports.workflowId = workflowId;
