# 2021 Census Agent Web App

A full-stack web application that lets users query 2021 Australian Census data through an OpenAI Agent connected to a Supabase database.

## Structure

- `backend/` — Express API server that calls the OpenAI Responses API
- `frontend/` — React (Vite) UI

## Local Development

### Backend

```bash
cd backend
cp .env.example .env   # fill in your keys
npm install
npm run dev            # http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `OPENAI_AGENT_ID` | Your OpenAI Agent ID |
| `ALLOWED_ORIGIN` | Frontend URL for CORS (e.g. `http://localhost:5173`) |
| `PORT` | Server port (default `3001`) |

### Frontend

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL (e.g. `http://localhost:3001`) |

Set in `.env.development` for local dev and `.env.production` for production builds.

## Deployment

- **Backend**: Deploy to [Railway](https://railway.app) — set root directory to `backend`
- **Frontend**: Deploy to [Vercel](https://vercel.com) — set root directory to `frontend`

After deploying both:
1. Set `VITE_API_URL` in Vercel to the Railway backend URL
2. Set `ALLOWED_ORIGIN` in Railway to the Vercel frontend URL
