const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    return res.status(400).json({ error: 'question is required and must be a non-empty string.' });
  }
  if (question.length > 1000) {
    return res.status(400).json({ error: 'question must be 1000 characters or fewer.' });
  }

  try {
    const run = await openai.responses.create({
      model: 'gpt-4o',
      agent_id: process.env.OPENAI_AGENT_ID,
      input: question.trim(),
    });

    return res.json({ answer: run.output_text });
  } catch (err) {
    console.error('[OpenAI Error]', err?.status, err?.message);

    if (err?.status === 429) {
      return res.status(429).json({ error: 'OpenAI rate limit reached. Try again shortly.' });
    }
    if (err?.status === 401) {
      return res.status(500).json({ error: 'Server configuration error.' });
    }
    return res.status(500).json({ error: 'Failed to get a response. Please try again.' });
  }
});

module.exports = router;
