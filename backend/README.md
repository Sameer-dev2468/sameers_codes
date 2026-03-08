# sam-ecommerce Backend (Prisma + Express)

This is a minimal backend scaffold using Prisma (MySQL) and Express to provide auth endpoints. It's designed to be deployed as a Node server or adapted to serverless functions on Vercel.

Setup (local, informational):

1. Copy `.env.example` to `.env` and fill `DATABASE_URL` (PlanetScale connection string) and `JWT_SECRET`.

2. Install dependencies:

```bash
cd backend
npm install
```

3. Prisma setup / generate:

```bash
npx prisma generate
# For local development migrations (not required for PlanetScale branching flow):
npx prisma migrate dev --name init
```

4. Run dev server:

```bash
npm run dev
```

Notes:
- PlanetScale requires careful migration flow; consult PlanetScale docs when pushing migrations.
- For Vercel serverless, consider using Prisma Data Proxy or adapt endpoints into serverless functions under `api/`.
  
Vercel serverless notes
- This repository includes example serverless handlers under `backend/api/auth/*` that mirror the Express routes. When deploying the `backend` project to Vercel, those files will be exposed as `https://<your-backend>.vercel.app/api/auth/*`.
- Make sure to set `DATABASE_URL` and `JWT_SECRET` in Vercel Environment Variables.
- Cookies are set using httpOnly cookies (`sid`) by the handlers; the frontend should call endpoints with `credentials: 'include'`.

Other serverless endpoints
- `GET /api/products` -> lists products (backend/api/products/index.js)
- `GET /api/products/:id` -> get product by id (backend/api/products/[id].js)
- `GET /api/orders` -> list orders for authenticated user (backend/api/orders/index.js)
- `POST /api/orders` -> create order for authenticated user (backend/api/orders/index.js)

These endpoints use the Prisma client. Ensure `DATABASE_URL` is configured and the schema is applied when deploying to production.

