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
| `OPENAI_AGENT_ID` | **Assistant** ID (`asst_...`) for the Assistants API — single Q&A form |
| `OPENAI_WORKFLOW_ID` | **Workflow** ID (`wf_...`) from Agent Builder — uses ChatKit chat UI |
| `ALLOWED_ORIGIN` | Frontend URL for CORS (e.g. `http://localhost:5173`) |
| `PORT` | Server port (default `3001`) |

Use **one** of `OPENAI_AGENT_ID` (assistant) or `OPENAI_WORKFLOW_ID` (workflow). For Agent Builder workflows, set `OPENAI_WORKFLOW_ID` to your `wf_...` ID; the app will show the ChatKit chat interface instead of the simple ask form.

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

---

## Step-by-step: Redeploy after code changes

### 1. Push your latest code

From your project root (e.g. `OpenAI Agent Front End`):

```bash
git add -A
git status   # confirm only intended files
git commit -m "Your message, e.g. Add workflow ID / ChatKit support"
git push origin master
```

(Use `main` instead of `master` if that’s your default branch.)

### 2. Redeploy the backend (Railway)

1. Open [Railway](https://railway.app) and sign in.
2. Open the project that hosts this app.
3. Click the **backend** service (the one whose root directory is `backend`).
4. Railway usually **auto-deploys** on push. Check the **Deployments** tab:
   - If a new deployment started after your push, wait until it shows **Success**.
   - If nothing started, click **Deploy** / **Redeploy** to trigger a new build.
5. **Environment variables** (Variables tab):
   - `OPENAI_API_KEY` — your OpenAI API key.
   - For a **workflow**: set `OPENAI_WORKFLOW_ID` to your `wf_...` ID (from Agent Builder).
   - For an **assistant**: set `OPENAI_AGENT_ID` to your `asst_...` ID.
   - `ALLOWED_ORIGIN` — your frontend URL, e.g. `https://your-app.vercel.app` (no trailing slash).
   - Do **not** set `PORT`; Railway sets it.
6. Copy the **public URL** of the backend (e.g. `https://xxx.up.railway.app`). You’ll use it in Vercel.

### 3. Redeploy the frontend (Vercel)

1. Open [Vercel](https://vercel.com) and sign in.
2. Open the project that hosts this app (root directory should be `frontend`).
3. Vercel usually **auto-deploys** on push. Check the **Deployments** tab:
   - If a new deployment ran after your push, wait until it’s **Ready**.
   - If not, open the **⋯** menu on the latest deployment and choose **Redeploy**.
4. **Environment variables** (Settings → Environment Variables):
   - `VITE_API_URL` — the **exact** backend URL from step 2 (e.g. `https://xxx.up.railway.app`), no trailing slash.
   - **Important:** Changing env vars does **not** automatically redeploy. After saving:
     - Go to **Deployments** → **⋯** on the latest deployment → **Redeploy**,  
     - or push a small commit and let the new build use the updated vars.

### 4. Point backend CORS at the frontend

1. Back in **Railway** → your backend service → **Variables**.
2. Set `ALLOWED_ORIGIN` to your **Vercel** URL (e.g. `https://your-project.vercel.app`), no trailing slash.
3. Save. Railway will redeploy the backend with the new value.

### 5. Verify

1. Open your **Vercel** app URL in a browser.
2. You should see either:
   - **Workflow:** ChatKit chat UI (if `OPENAI_WORKFLOW_ID` is set).
   - **Assistant:** Single question box (if `OPENAI_AGENT_ID` is set).
3. Ask a test question. If you get a CORS or “invalid response” error, double-check:
   - `ALLOWED_ORIGIN` in Railway = exact Vercel URL.
   - `VITE_API_URL` in Vercel = exact Railway backend URL.
   - You redeployed the frontend after changing `VITE_API_URL`.
