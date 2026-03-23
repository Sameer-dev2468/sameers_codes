# 🛒 Vellique — SAM E-Commerce

A modern, full-stack e-commerce application built with **React** and **Node.js**, featuring smooth page transitions, JWT authentication, and a clean shopping experience.

> **Live Demo:** Deployed on [Vercel](https://vercel.com)

---

## ✨ Features

- 🏠 **Home Page** — Curated product grid with search functionality
- 📦 **Product Detail** — Individual product pages with add-to-cart
- 🛒 **Shopping Cart** — Persistent cart with quantity management
- 🔐 **Authentication** — Sign in / sign up with JWT and bcrypt
- 🎞️ **Smooth Animations** — Page transitions powered by Framer Motion
- 📱 **Responsive Design** — Mobile-first layout with TailwindCSS
- 🔍 **Search** — Real-time product search across the catalog

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [React 18](https://react.dev) | UI framework |
| [Vite](https://vitejs.dev) | Build tool & dev server |
| [React Router v6](https://reactrouter.com) | Client-side routing |
| [TailwindCSS 3](https://tailwindcss.com) | Utility-first CSS |
| [Framer Motion](https://www.framer.com/motion/) | Page transition animations |

### Backend
| Technology | Purpose |
|---|---|
| [Express.js](https://expressjs.com) | REST API server |
| [Prisma ORM](https://www.prisma.io) | Database toolkit |
| [MySQL](https://www.mysql.com) | Relational database |
| [JSON Web Tokens](https://jwt.io) | Stateless authentication |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | Password hashing |

### Deployment
| Technology | Purpose |
|---|---|
| [Vercel](https://vercel.com) | Hosting & CI/CD |
| Vercel Serverless Functions | API endpoints |

---

## 📁 Project Structure

```
sam-ecommerce/
├── frontend/                   # React + Vite SPA
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Header.jsx      # Navigation bar with search
│   │   │   ├── Footer.jsx      # Site footer
│   │   │   └── ProductCard.jsx # Product grid card
│   │   ├── pages/              # Route-level page components
│   │   │   ├── Home.jsx        # Landing page with product grid
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── CartPage.jsx
│   │   │   └── SignIn.jsx
│   │   ├── context/            # React Context providers
│   │   │   ├── AuthContext.jsx # JWT auth state management
│   │   │   ├── CartContext.jsx # Shopping cart state
│   │   │   └── SearchContext.jsx
│   │   ├── data/
│   │   │   └── products.js    # Product catalog data
│   │   ├── styles/
│   │   │   └── index.css      # Global styles + Tailwind imports
│   │   ├── App.jsx            # Root component with routing
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.cjs
│   └── package.json
│
├── backend/                    # Express.js API
│   ├── api/
│   │   ├── auth/              # Login, register, logout endpoints
│   │   ├── products/          # Product CRUD endpoints
│   │   └── orders/            # Order management endpoints
│   ├── prisma/
│   │   └── schema.prisma      # Database schema (User, Product, Order, OrderItem)
│   ├── src/                   # Server source code
│   └── package.json
│
├── vercel.json                # Vercel deployment configuration
└── package.json               # Root build scripts
```

---

## 🗄️ Database Schema

```
┌──────────┐     ┌──────────┐     ┌───────────┐     ┌───────────┐
│   User   │────<│  Order   │────<│ OrderItem │>────│  Product  │
├──────────┤     ├──────────┤     ├───────────┤     ├───────────┤
│ id       │     │ id       │     │ id        │     │ id        │
│ email    │     │ userId   │     │ orderId   │     │ name      │
│ password │     │ totalCents│    │ productId │     │ description│
│ name     │     │ status   │     │ quantity  │     │ priceCents│
│ createdAt│     │ createdAt│     │ unitCents │     │ sku       │
└──────────┘     └──────────┘     └───────────┘     │ imageUrl  │
                                                     │ createdAt │
                                                     └───────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MySQL](https://www.mysql.com/) database
- [Git](https://git-scm.com/)

### 1. Clone the repository

```bash
git clone https://github.com/Sameer-dev2468/SAM_codes.git
cd SAM_codes/sam-ecommerce
```

### 2. Set up the Backend

```bash
cd backend
npm install

# Create your environment file
cp .env.example .env
```

Edit `backend/.env` with your credentials:

```env
DATABASE_URL="mysql://<username>:<password>@<host>/<database>?sslaccept=strict"
JWT_SECRET=replace_this_with_a_strong_secret
PORT=4000
```

Run the database migrations:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Start the backend server:

```bash
npm run dev
```

### 3. Set up the Frontend

```bash
cd ../frontend
npm install

# Create your environment file
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:4000
```

Start the frontend dev server:

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 🌐 Deployment (Vercel)

This project is configured for **Vercel monorepo deployment** via `vercel.json`:

- **Frontend** → Built with `@vercel/static-build`, outputs to `dist/`
- **Backend API** → Deployed as serverless functions via `@vercel/node`
- **Routing** → Uses `rewrites` for SPA fallback to `index.html`

To deploy:

1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Set the **Root Directory** to `sam-ecommerce`
3. Add environment variables (`DATABASE_URL`, `JWT_SECRET`) in Vercel dashboard
4. Push to `main` — Vercel auto-deploys on every push

---

## 📜 Available Scripts

### Frontend (`/frontend`)
| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |

### Backend (`/backend`)
| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon (hot reload) |
| `npm start` | Start production server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is private and proprietary.

---

<p align="center">
  Built with ❤️ by <strong>Sameer</strong>
</p>
