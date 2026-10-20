# ShopNest — Royal Indian Luxury E-Commerce Marketplace

<p align="center">
  <strong>A premium, full-stack shopping experience inspired by Indian heritage and modern luxury.</strong>
  <br />
  Discover curated products through an elegant storefront backed by a secure REST API.
</p>

<p align="center">
  <a href="https://isha-fx728nwdb-pro-dev21.vercel.app">
    <img src="https://img.shields.io/badge/Live_Storefront-Visit_ShopNest-641C32?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Storefront" />
  </a>
  <a href="https://isha-backend-2qq5.onrender.com/api/v1/health">
    <img src="https://img.shields.io/badge/Backend-Production_API-46E3B7?style=for-the-badge&logo=render&logoColor=black" alt="Production API" />
  </a>
  <a href="https://github.com/venkidev21/Isha">
    <img src="https://img.shields.io/badge/Source_Code-GitHub-181717?style=for-the-badge&logo=github" alt="Source Code" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-20232A?style=flat&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-20%2B-339933?style=flat&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=flat&logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?style=flat&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat" alt="MIT License" />
</p>

---

## Overview

**ShopNest** is a full-stack, multi-category e-commerce platform combining a Royal Indian Luxury visual identity with modern web application architecture.

The project brings together an editorial shopping experience, interactive product discovery, cart and wishlist management, customer accounts, checkout workflows, and a REST API designed to support the storefront.

Its design draws inspiration from Indian craftsmanship, rich burgundy tones, antique gold accents, and contemporary luxury retail.

## Live Application

| Component | Link |
|---|---|
| Customer storefront | [Visit ShopNest](https://isha-fx728nwdb-pro-dev21.vercel.app) |
| About and heritage | [Explore the About page](https://isha-fx728nwdb-pro-dev21.vercel.app/about) |
| Backend API health endpoint | [Check API status](https://isha-backend-2qq5.onrender.com/api/v1/health) |
| Source repository | [GitHub — Isha](https://github.com/venkidev21/Isha) |

> **Deployment note:** These links identify the configured deployment URLs. Feature availability, API health, and production readiness should be verified against the live application.

## Design System

ShopNest uses a restrained luxury palette to create a consistent visual experience across product listings, navigation, checkout, and account pages.

| Design element | Color / typography | Purpose |
|---|---|---|
| Royal maroon | `#641C32` | Primary actions and brand identity |
| Deep burgundy | `#421321` | Dark navigation and footer surfaces |
| Warm ivory | `#FAF6EF` | Main page backgrounds |
| Warm white | `#FFFDFA` | Product cards and content surfaces |
| Antique gold | `#B69A62` | Subtle highlights and decorative accents |
| Editorial typeface | Cormorant Garamond | Headings and campaign titles |
| Interface typeface | Manrope | Navigation, forms, and body text |

The design is intended to work across multiple product categories, including fashion, electronics, watches, homeware, wellness, and artisanal products.

## Features

### Shopping experience
- Editorial homepage with campaign sections and responsive calls to action.
- Category browsing and product catalogue exploration.
- Product cards with consistent image ratios, pricing, and discount indicators.
- Wishlist interactions and quick-add shopping controls.
- Dedicated cart page and slide-out cart drawer.
- Quantity controls and dynamic shipping-progress display.

### Checkout and customer accounts
- Multi-step checkout interface.
- Delivery address management with PIN code validation.
- Payment method selection for UPI, cards, and cash on delivery.
- Order confirmation and order-history interfaces.
- Order lifecycle statuses, including processing, shipped, and delivered.
- Order cancellation and inventory-restoration workflows.
- Saved delivery addresses.

**Payment note:** Selecting a payment method in the interface does not by itself establish that a live payment gateway is integrated. Verify payment processing and server-side order validation before accepting real transactions.

### Backend and security
- REST API built with Node.js and Express.
- Prisma-based database access.
- JWT-based authentication.
- Password hashing with bcrypt.
- Request validation using Zod.
- Security headers with Helmet.
- Configurable CORS restrictions.
- Centralized application routing and business logic.

Security features should be validated through testing and deployment configuration before the application is treated as production-ready.

## Technology Stack

### Frontend

| Technology | Role |
|---|---|
| React 19 | User interface |
| TypeScript | Type safety |
| Vite 8 | Development server and build tooling |
| React Router DOM 7 | Client-side navigation |
| Custom CSS | Responsive styling and design system |
| Lucide React | Interface icons |
| Vercel | Frontend hosting |

### Backend

| Technology | Role |
|---|---|
| Node.js 20+ | JavaScript runtime |
| Express 5 | REST API framework |
| TypeScript | Backend type safety |
| Prisma Client 6 | Database access |
| SQLite / PostgreSQL | Database options, depending on configuration |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Helmet | HTTP security headers |
| Zod | Request validation |
| Render | Backend hosting |

## Architecture

```text
ShopNest
│
├── Frontend (React + TypeScript + Vite)
│   ├── Pages and components
│   ├── Authentication context
│   ├── Cart and wishlist state
│   └── API client and services
│
└── Backend (Node.js + Express + TypeScript)
    ├── REST API routes
    ├── Controllers
    ├── Services and business logic
    ├── Authentication and validation middleware
    └── Prisma ORM
        └── Configured database
```

The frontend communicates with the backend through HTTP API requests. The deployed frontend and backend are hosted separately, allowing each application to be built and deployed independently.

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm
- Git
- A database compatible with the configured Prisma schema

### 1. Clone the repository

```bash
git clone https://github.com/venkidev21/Isha.git
cd Isha
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a backend `.env` file using the variable names expected by your application. For example:

```env
PORT=5000
DATABASE_URL="your-database-connection-string"
JWT_SECRET="replace-with-a-strong-random-secret"
```

> The exact environment variables depend on your code and Prisma configuration. Do not commit real credentials or production secrets.

Generate the Prisma client and apply the appropriate database setup:

```bash
npx prisma generate
```

For a local development database, use the migration or schema-sync workflow supported by your project. If your project uses Prisma migrations, run:

```bash
npx prisma migrate dev
```

If your project specifically uses `prisma db push`, follow that workflow instead. Configure the database provider and connection string before running either command.

If a seed script is configured in `package.json`, run:

```bash
npm run seed
```

Start the backend:

```bash
npm run dev
```

The API should be available at:

```text
http://localhost:5000/api/v1
```

### 3. Configure the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create the frontend environment file expected by your API client. For a Vite application using this variable name:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite, typically:

```text
http://localhost:5173
```

**Important:** Confirm the actual API environment variable name, database provider, and available npm scripts in your repository before using these commands unchanged.

## Deployment

### Frontend — Vercel

- Import the repository into Vercel.
- Set the frontend root directory to `frontend`.
- Configure the production API URL using the variable expected by your frontend.
- Build using the project's configured build script.
- Configure SPA rewrites if required by React Router.
- Redeploy after changing production environment variables.

### Backend — Render

- Create a Web Service linked to the repository.
- Set the backend root directory to `backend`.
- Configure the build and start commands to match `package.json`.
- Set production environment variables in the Render dashboard.
- Configure the database connection and run required migrations.
- Allow only the appropriate production frontend origins through CORS.
- Verify the health endpoint and important API routes after deployment.

For a persistent production database, use a properly configured PostgreSQL instance or another supported managed database. Do not assume a local SQLite database file will persist across deployments or be shared correctly between multiple service instances.

## Project Structure

```text
Isha/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.ts
│   │   └── server.ts
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── index.css
│   └── vercel.json
│
├── .gitignore
└── README.md
```

## Demo Accounts

Use demo accounts only when they have been created and verified in the configured database.

| Role | Email |
|---|---|
| Customer | `customer@shopnest.com` |
| Administrator | `admin@shopnest.com` |

Demo passwords are intentionally omitted from this public README. Configure non-production demo credentials through your seed script and never publish real administrator credentials.

## Roadmap

Potential improvements for future releases:

- [ ] Dedicated administrator dashboard and role-based access controls.
- [ ] Production payment gateway integration and webhook verification.
- [ ] Automated tests for authentication, checkout, and inventory.
- [ ] Product image optimization and reliable image hosting.
- [ ] Order notifications and shipment tracking integrations.
- [ ] CI/CD checks and deployment health monitoring.
- [ ] Accessibility and performance audits.

## Contributing

Contributions and constructive feedback are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes and test them.
4. Open a pull request describing the changes.



---

<p align="center">
  <strong>ShopNest</strong>
  <br />
  Royal Indian Luxury. Modern E-Commerce.
  <br />
  Built by <a href="https://github.com/venkidev21">Venkatesan E</a>.
</p>
