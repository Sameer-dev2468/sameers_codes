# Deploy to Vercel — runbook

This document contains the exact steps and environment variables needed to deploy the monorepo to Vercel.

1) Prerequisites

- A Vercel account and the `vercel` CLI installed: `npm i -g vercel`.
- A production database (PlanetScale recommended) and credentials.

2) Files added
- Root: `vercel.json` — monorepo config mapping `/api/*` to `sam-ecommerce/backend/api` and static build to `sam-ecommerce/frontend/dist`.

3) Environment variables (set in Vercel Project -> Settings -> Environment Variables)

- `DATABASE_URL` — PlanetScale (or MySQL) connection string used by Prisma in production.
- `PRISMA_DATA_PROXY_URL` — (optional) Prisma Data Proxy URL if using Data Proxy.
- `JWT_SECRET` — strong secret for signing JWTs.
- `NODE_ENV` — set to `production`.
- `VITE_API_URL` — frontend value pointing to your deployed API root, e.g. `https://your-app.vercel.app/api`.
- `DEV_AUTH` — ensure `false` in production.

4) Recommended Prisma / PlanetScale notes

- For PlanetScale, prefer using the Prisma Data Proxy or follow PlanetScale's recommended migration flow (deploy requests). Running `prisma migrate` directly against PlanetScale requires the deploy-request workflow. See PlanetScale docs.
- After provisioning DATABASE_URL and/or Data Proxy, run migrations on a separate machine (not inside Vercel serverless) using:

```bash
npx prisma generate
npx prisma migrate deploy --preview-feature
```

5) Quick deploy commands (local)

```powershell
# from repo root
vercel login
vercel link  # link to an existing project or create a new one
# set env vars via CLI or Vercel UI
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
# deploy to preview first
vercel --prod
```

6) Post-deploy checks

- Visit `https://<your-vercel-domain>/api/health` to confirm backend is live.
- Confirm frontend loads and API calls succeed (CORS and cookie settings require `VITE_API_URL` to be the deployed API origin).

7) Rollback & Notes

- Vercel keeps previous deployments — roll back from the Vercel dashboard if needed.
- Ensure `secure` cookie setting for `sid` is enabled in production (code already uses `process.env.NODE_ENV === 'production'`).
