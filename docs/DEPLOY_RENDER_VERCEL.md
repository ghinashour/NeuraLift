# Deploy: Render (backend API) + Vercel (frontend)

Split hosting: **Render = Express + Socket.io API**, **Vercel = React SPA**.
CORS/Socket allow both `CLIENT_ORIGIN` and `CLIENT_URL`. Set both: `CLIENT_ORIGIN`
is the allowed browser origin list; `CLIENT_URL` is the single frontend origin used
in OAuth redirects, verification emails, and invitation links.

## 0. Prerequisites

- MongoDB Atlas cluster and database user. Allow your Render service's outbound
  IP ranges in Atlas Network Access and copy the database connection string:
  `mongodb+srv://user:password@cluster/neuralift` (URL-encode special password characters).
- Groq key (optional but recommended): https://console.groq.com → API keys.
- Google OAuth web client ID and secret, plus an OpenAI API key. The current backend
  initializes GoogleStrategy and OpenAI clients at startup, so these values are
  required to boot even if you only plan to use password login or Groq chat.
- Gmail account and app password for verification emails (`MAIL_USER`, `MAIL_PASS`).
  Signup sends a verification email and login rejects unverified accounts.
  The current verification helper uses Gmail SMTP; changing `MAIL_HOST` alone
  does not change that provider.
- A paid Render web service for the current email implementation. Render Free
  [blocks SMTP ports 25, 465, and 587](https://render.com/docs/free#other-limitations).
  The Blueprint defaults to Free for previewing; choose a paid compute plan in
  Render for working SMTP. An HTTPS email-provider integration would require code changes.

## 1. Backend on Render

1. Push repo to GitHub (`master` branch).
2. Render Dashboard → **New → Blueprint** → select repo → `render.yaml` creates service `neuralift-backend`
   (`rootDir: backend`, build `npm install`, start `node index.js`, health check `/api/health`).
   - Alternative manual: New → Web Service → select `ghinashour/NeuraLift`, Branch
     `master`, Root Directory `backend`, Build `npm install`, Start `npm start`,
     Health Check Path `/api/health`. Use Node 22 LTS (for example `NODE_VERSION=22`).
   - Use the root `render.yaml`, not the legacy `backend/.render.yaml`.
   - Keep `npm install` as the build command for now: the existing backend lockfile
     is out of sync with `package.json`, so `npm ci` currently fails.
3. Set env vars (Render → Service → Environment):
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=<32+ random chars>
   JWT_REFRESH_SECRET=<32+ random chars>
   CLIENT_ORIGIN=https://<your-app>.vercel.app
    CLIENT_URL=https://<your-app>.vercel.app
    API_URL=https://<backend>.onrender.com
    OPENAI_API_KEY=<openai key>
   GROQ_API_KEY=<groq key>
   GROQ_MODEL=llama-3.3-70b-versatile
    GOOGLE_CLIENT_ID=<google OAuth web client ID>
    GOOGLE_CLIENT_SECRET=<google OAuth client secret>
   GOOGLE_CALLBACK_URL=https://<backend>.onrender.com/api/auth/google/callback
    MAIL_USER=<gmail address>
    MAIL_PASS=<gmail app password>
   ```
   Do NOT set `PORT` — Render injects it. Set `API_URL` to the service URL once
   Render assigns it; it is used by resend-verification emails. Backend and
   frontend origins have no trailing slash or `/api`.
   Generate each JWT secret independently, for example:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
   Keep these secrets in Render, not Vercel's `REACT_APP_*` variables.
   In Google Cloud Console, configure the web client's authorized JavaScript
   origin as the Vercel origin and authorized redirect URI as `GOOGLE_CALLBACK_URL`.
4. Deploy → verify `GET https://<backend>.onrender.com/api/health` returns
   `{"ok":true,"mongo":"connected",...}`.
   - `mongo: disconnected` → check `MONGO_URI` / Atlas IP allowlist.
    - Free tier sleeps after inactivity; waking it can take about a minute.
      Not every frontend request retries automatically.

## 2. Frontend on Vercel

1. Vercel → Add New Project → import repo → **Root Directory = `frontend`**,
   Framework preset `Create React App`, Build `npm run build`, Output `build`
    (`frontend/vercel.json` already sets rewrites + static caching).
    Set the Production Branch to `master`.
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
- [ ] For Vercel Preview deployments, add each exact preview origin to the comma-separated
      `CLIENT_ORIGIN` allowlist. Keep `CLIENT_URL` as one canonical frontend URL.
- [ ] Google console authorized redirect = `GOOGLE_CALLBACK_URL`.
- [ ] Socket.io connects (polling → websocket upgrade). Transports are `["polling","websocket"]`.
- [ ] `uploads/` files are ephemeral on Render free — for persistent avatars use S3/Cloudinary (current `.dockerignore` excludes uploads).
- [ ] In browser DevTools → Network, API requests target `https://<backend>.onrender.com/api/...`,
      not `localhost`, the Vercel host, or paths containing `/api/api`.
- [ ] Test signup → verification email → login, then tasks, games, and chat.

### Email features beyond signup

The contact form uses a separate SMTP helper. Configure `EMAIL_HOST`, `EMAIL_PORT`,
`EMAIL_USERNAME`, `EMAIL_PASSWORD`, `EMAIL_FROM`, and `CONTACT_EMAIL` for it.
The legacy reset-password email helper uses `EMAIL_USER` and `EMAIL_PASS`.

## 4. Local prod smoke test

```bash
# backend
cd backend
npm install
# Create backend/.env from .env.example and fill the startup credentials above.
npm start
curl http://localhost:4000/api/health

# frontend (separate shell)
cd frontend && npm install
REACT_APP_API_URL=http://localhost:4000 npm start
```
