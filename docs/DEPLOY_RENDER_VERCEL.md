# Deploy: Render backend + Vercel frontend

## 1. Update the existing Render service

Push these changes to `master`, then use **Settings** on the existing
`neuralift-deploy-app` service. Creating another service is unnecessary.

| Setting | Value |
| --- | --- |
| Runtime | Node |
| Branch | `master` |
| Root Directory | `backend` |
| Build Command | `npm ci --omit=dev` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |

The backend requires Node 22.x. The Dockerfile and root `render.yaml` use the same
major version. The root Blueprint is also available for new deployments; update
its frontend/backend URLs if deploying to different domains. For an existing
manually created service, update settings and environment variables in the
dashboard; editing the Blueprint alone does not update that service.

## 2. Set Render environment variables

```dotenv
NODE_ENV=production
NODE_VERSION=22
MONGO_URI=<MongoDB Atlas connection string>
JWT_SECRET=<long random secret>
JWT_REFRESH_SECRET=<different long random secret>
CLIENT_ORIGIN=https://neura-lift.vercel.app
CLIENT_URL=https://neura-lift.vercel.app
API_URL=https://neuralift-deploy-app.onrender.com
RESEND_API_KEY=<Resend API key>
EMAIL_FROM=Neuralift <noreply@your-verified-domain.com>
CONTACT_EMAIL=<your support inbox>
```

Replace placeholders with real values in Render, without surrounding quotes.
Keep secrets in Render, not frontend `REACT_APP_*` variables. Render supplies
`PORT` automatically. Generate each JWT secret independently:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

For MongoDB Atlas, use the database user's credentials (not the Atlas website
login), URL-encode special password characters, and allow the Render service's
outbound IP ranges in **Network Access**. Replace any real credentials previously
stored in example files and rotate them in Atlas.

`CLIENT_ORIGIN` accepts a comma-separated list of exact browser origins. Add
individual Vercel preview origins when needed. `CLIENT_URL` is one canonical
frontend origin for redirects and email links. Neither URL should contain
`/login`, `/api`, or a trailing slash. HTTP CORS and Socket.IO use these origins.

### Resend email on Render Free

All three email helpers (verification, password reset, and contact) use Resend's
HTTPS API. SMTP/Ethereal configuration is no longer used by those helpers.

1. Create a Resend account and verify a domain you control in **Domains**, adding
   the DNS records Resend provides.
2. Create an API key with sending access for that domain; set `RESEND_API_KEY`.
3. Set `EMAIL_FROM` to an address on the verified domain. A Gmail address is not
   a verified-domain sender. Resend's testing sender is restricted to test
   recipients and is not suitable for public signup verification.
4. Set `CONTACT_EMAIL` to the inbox that should receive support messages.
5. Save and redeploy, then test signup → verification email → login.

Missing email configuration does not stop startup, but email-dependent requests
cannot succeed until it is configured. If an earlier signup saved an account
before email delivery failed, request a new email with
`POST /api/auth/resend-verification` and JSON `{"email":"your-address@example.com"}`
after configuring Resend.

### Optional integrations

- **Groq chat:** set `GROQ_API_KEY`; `GROQ_MODEL` defaults to
  `llama-3.3-70b-versatile`. `/api/chat` supports Groq without OpenAI credentials.
- **OpenAI:** set `OPENAI_API_KEY` to enable `/api/chat-history` and the OpenAI
  portion of `/api/assistant`. Without it, those endpoints return JSON `503`
  instead of preventing the backend from starting. Retrieval in `/api/assistant`
  still requires its separate Pinecone package/configuration.
- **OpenRouter fallback:** set `OPENROUTER_API_KEY` if desired.
- **Google login:** set both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, plus
  `GOOGLE_CALLBACK_URL=https://neuralift-deploy-app.onrender.com/api/auth/google/callback`.
  Register that exact callback in Google Cloud Console and the Vercel origin as
  the authorized JavaScript origin. Without both credentials, Google login and
  callback routes return JSON `503`; password login remains available.

## 3. Vercel environment

Use Root Directory `frontend`, framework **Create React App**, build command
`npm run build`, and output directory `build`. Set:

```dotenv
REACT_APP_API_URL=https://neuralift-deploy-app.onrender.com
```

Use no trailing slash or `/api`. Redeploy Vercel after changing this variable:
Create React App embeds it during the build. The deployed frontend already used
this backend URL when checked.

## 4. Verify the deployment

- `GET https://neuralift-deploy-app.onrender.com/api/health` should return `200`
  with `{"ok":true,"mongo":"connected",...}`. Both `/health` and `/api/health`
  return `503` while MongoDB is disconnected. Check Render logs, Atlas credentials,
  and the network allowlist if readiness never succeeds.
- A login preflight (`OPTIONS /api/auth/login`) from
  `https://neura-lift.vercel.app` should return `204` and
  `Access-Control-Allow-Origin: https://neura-lift.vercel.app`.
- Test password login, signup/verification, chat, and enabled Google login.
- If the browser reports CORS but health also returns `500`, inspect Render logs
  for the underlying backend error. A proxy/startup failure can lack CORS headers.
- Render Free sleeps after inactivity; a cold start can take about a minute.
  Uploaded files remain ephemeral; use external storage for durable avatars.

## 5. Local verification

From `backend`:

```sh
npm ci
npm run test:deployment
npm test
```

The deployment checks use local HTTP requests and mocked email/AI delivery;
they require no real keys or database. The existing game tests use an in-memory
MongoDB binary, which may need to download on first run.

For manual development, copy `.env.example` to `.env`, configure MongoDB and JWT
secrets plus whichever integrations you use, then run `npm start`.
