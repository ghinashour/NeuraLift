# Deploy: Render (backend API) + Vercel (frontend)

Split hosting: **Render = Express + Socket.io API**, **Vercel = React SPA**.
CORS/Socket allow both `CLIENT_ORIGIN` and `CLIENT_URL`, so setting either one works.

## 0. Prerequisites

- MongoDB Atlas cluster (Render free disk is ephemeral — do NOT use Render-hosted Mongo for prod).
  Create → Network Access `0.0.0.0/0` (or Render IPs) → get `mongodb+srv://user:pass@cluster/db`.
- Groq key (optional but recommended): https://console.groq.com → API keys.
- Google OAuth client (if login-with-Google is used).

## 1. Backend on Render

1. Push repo to GitHub (`main` branch).
2. Render Dashboard → **New → Blueprint** → select repo → `render.yaml` creates service `neuralift-backend`
   (`rootDir: backend`, build `npm install`, start `node index.js`, health check `/api/health`).
   - Alternative manual: New → Web Service → Root Directory `backend`, Build `npm install`, Start `node index.js`.
3. Set env vars (Render → Service → Environment):
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=<32+ random chars>
   JWT_REFRESH_SECRET=<32+ random chars>
   CLIENT_ORIGIN=https://<your-app>.vercel.app
   CLIENT_URL=https://<your-app>.vercel.app
   GROQ_API_KEY=<groq key>
   GROQ_MODEL=llama-3.3-70b-versatile
   GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET (if used)
   GOOGLE_CALLBACK_URL=https://<backend>.onrender.com/api/auth/google/callback
   MAIL_HOST / MAIL_PORT / MAIL_USER / MAIL_PASS (if emails used)
   ```
   Do NOT set `PORT` — Render injects it.
4. Deploy → verify `GET https://<backend>.onrender.com/api/health` returns
   `{"ok":true,"mongo":"connected",...}`.
   - `mongo: disconnected` → check `MONGO_URI` / Atlas IP allowlist.
   - Free tier sleeps: first request after idle can take ~50s; frontend handles retry.

## 2. Frontend on Vercel

1. Vercel → Add New Project → import repo → **Root Directory = `frontend`**,
   Framework preset `Create React App`, Build `npm run build`, Output `build`
   (`frontend/vercel.json` already sets rewrites + static caching).
2. Environment variable (Production + Preview):
   ```
   REACT_APP_API_URL=https://<backend>.onrender.com
   ```
   No trailing `/api`, no quotes. Redeploy after changing it (CRA inlines at build time).
3. Deploy → open `https://<your-app>.vercel.app`, test signup/login.
   - If API calls hit `localhost:4000`, `REACT_APP_API_URL` was missing at build time.

## 3. Wire-up checklist

- [ ] Backend `/api/health` → 200, `mongo: connected`.
- [ ] `CLIENT_ORIGIN`/`CLIENT_URL` on Render exactly equal the Vercel origin (`https://...`, no trailing slash).
- [ ] Google console authorized redirect = `GOOGLE_CALLBACK_URL`.
- [ ] Socket.io connects (polling → websocket upgrade). Transports are `["polling","websocket"]`.
- [ ] `uploads/` files are ephemeral on Render free — for persistent avatars use S3/Cloudinary (current `.dockerignore` excludes uploads).

## 4. Local prod smoke test

```bash
# backend
cd backend && npm install
PORT=4000 MONGO_URI=mongodb://127.0.0.1:27017/NeuraLift JWT_SECRET=test node index.js
curl http://localhost:4000/api/health

# frontend (separate shell)
cd frontend && npm install
REACT_APP_API_URL=http://localhost:4000 npm start
```
