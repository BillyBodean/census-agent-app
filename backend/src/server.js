require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimiter = require('./middleware/rateLimiter');
const askRouter = require('./routes/ask');

const app = express();

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,
  methods: ['POST'],
}));
app.use(express.json({ limit: '16kb' }));
app.use(morgan('combined'));
app.use('/ask', rateLimiter);
app.use('/ask', askRouter);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
