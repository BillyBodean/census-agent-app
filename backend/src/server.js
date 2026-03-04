require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimiter = require('./middleware/rateLimiter');
const askRouter = require('./routes/ask');
const chatkitRouter = require('./routes/chatkit');
const { isWorkflowId } = require('./routes/chatkit');

const app = express();

app.set('trust proxy', 1);

const allowedOrigins = [process.env.ALLOWED_ORIGIN, 'https://cdn.platform.openai.com'].filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, origin || true);
    cb(null, false);
  },
  methods: ['GET', 'POST'],
}));
app.use(express.json({ limit: '16kb' }));
app.use(morgan('combined'));

app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.get('/config', (_, res) => {
  const id = process.env.OPENAI_WORKFLOW_ID || process.env.OPENAI_AGENT_ID;
  const mode = isWorkflowId(id) ? 'workflow' : 'assistant';
  res.json({ mode });
});

app.use('/ask', rateLimiter);
app.use('/ask', askRouter);

app.use('/chatkit', rateLimiter);
app.use('/chatkit', chatkitRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
