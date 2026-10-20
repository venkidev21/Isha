# ShopNest — Royal Indian Luxury E-Commerce Marketplace

[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://isha-fx728nwdb-pro-dev21.vercel.app)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://isha-backend-2qq5.onrender.com/api/v1/health)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_6.0-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

> **ShopNest** is a full-stack, multi-category e-commerce platform reimagined with an exquisite **Royal Indian Luxury aesthetic**. It marries the timeless majesty of Indian artisanal heritage with the performance, precision, and usability of a contemporary global marketplace.

---

## 🌐 Live Deployments

- 🛍️ **Live Storefront (Vercel):** [https://isha-fx728nwdb-pro-dev21.vercel.app](https://isha-fx728nwdb-pro-dev21.vercel.app)
- ⚙️ **Production REST API (Render):** [https://isha-backend-2qq5.onrender.com](https://isha-backend-2qq5.onrender.com/api/v1/health)
- 📖 **About & Heritage:** [https://isha-fx728nwdb-pro-dev21.vercel.app/about](https://isha-fx728nwdb-pro-dev21.vercel.app/about)

---

## 🎨 Design Philosophy: Royal Indian Luxury

ShopNest moves away from cookie-cutter marketplace templates to deliver a curated editorial experience:

| Element | Description | Specification |
|---|---|---|
| **Primary Maroon** | Royal Indian identity, primary actions, and badges | `#641C32` |
| **Deep Burgundy** | Announcement strip, dark navigation, luxury footer | `#421321` |
| **Warm Ivory** | Elegant background canvas, eliminating harsh blue/white glare | `#FAF6EF` |
| **Pure Warm-White** | Product display surfaces with subtle hairline borders | `#FFFDFA` |
| **Antique Gold** | Highlights, rating stars, crest marks, and micro-accents | `#B69A62` |
| **Editorial Typography** | Headings, hero banners, and department titles | `Cormorant Garamond` (Serif) |
| **Interface Typography** | Navigation, pricing, forms, specs, and body copy | `Manrope` (Clean Sans-Serif) |

> 🏛️ **True Multi-Category Elegance:** The design naturally scales across high-tech acoustics, automatic horology, tailored fashion, artisanal homeware, organic wellness, and handcrafted brassware without stereotyping or excessive ornamentation.

---

## ✨ Key Features

- **Royal Editorial Hero:** Curated campaigns, dual-column editorial layout, and responsive luxury CTAs.
- **Department Browsing:** Refined category pills and cards with live catalog counts.
- **Precision Product Cards:**
  - 4:5 luxury aspect ratio image containers with smooth hover zoom.
  - Indian Rupee (₹) price hierarchy with understated percentage badges.
  - Circular wishlist toggle with optimistic feedback.
  - Express quick-add to shopping bag.
- **Interactive Shopping Bag & Drawer:**
  - Slide-over drawer and dedicated `/cart` page with line-item quantity controls.
  - Dynamic free insured shipping meter.
- **3-Step Royal Checkout:**
  - Delivery address book management with PIN code validation.
  - Payment gateway selection (UPI, Credit/Debit Cards, Cash on Delivery).
  - Server-verified price totals and instant order confirmation receipts.
- **Patron Account & Order Tracking:**
  - Complete order history with lifecycle statuses (`Processing`, `Shipped`, `Delivered`).
  - Order cancellation and inventory release support.
  - Saved multi-address management.
- **Enterprise Security:**
  - Helmet security headers, CORS origin protection, JWT authentication, and Zod input validation.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
- **Framework:** React 19 + TypeScript + Vite 8
- **Routing:** React Router DOM v7 (SPA with `vercel.json` rewrites)
- **Styling:** Custom Vanilla CSS Design System with CSS Variables (zero bloat, instant rendering)
- **Icons:** Lucide React
- **Hosting:** Vercel Global Edge Network

### **Backend**
- **Runtime:** Node.js (v20+) + Express.js 5
- **ORM:** Prisma Client v6
- **Database:** SQLite / PostgreSQL
- **Security:** JWT, bcryptjs, Helmet, Zod
- **Hosting:** Render Cloud Web Service

---

## 🚀 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/venkidev21/Isha.git
cd Isha
```

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```
> The API will be available at `http://localhost:5000/api/v1`

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
> The storefront will run at `http://localhost:5173`

---

## 🔑 Demo Access Credentials

| Role | Email | Password |
|---|---|---|
| **Patron / Customer** | `customer@shopnest.com` | `CustomerPassword123!` |
| **Atelier Admin** | `admin@shopnest.com` | `AdminPassword123!` |

---

## 📁 Project Directory Structure

```
Isha/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Prisma Database Schema
│   │   └── seed.ts              # Catalog & User Seeder
│   ├── src/
│   │   ├── controllers/         # Request Handlers
│   │   ├── middleware/          # JWT & Error Middlewares
│   │   ├── routes/              # Express API Routes
│   │   ├── services/            # Business Logic
│   │   ├── app.ts               # Express Configuration
│   │   └── server.ts            # Entrypoint
│   └── tsconfig.json
├── frontend/
│   ├── public/                  # Assets, Badges, Icons
│   ├── src/
│   │   ├── components/          # ProductCard, Navbar, Footer, CartDrawer
│   │   ├── context/             # Auth, Cart, Wishlist, Toast Providers
│   │   ├── pages/               # Catalogue, ProductDetail, Checkout, Profile
│   │   ├── services/            # API Client Layer
│   │   └── index.css            # Royal Indian Luxury Design System
│   └── vercel.json              # Client-Side Routing Configuration
├── .gitignore
└── README.md
```

---

## 📄 License

Distributed under the **MIT License**. Crafted with precision and pride for discerning shoppers.

---

**Developed with ❤️ by [Venkatesan E (venkidev21)](https://github.com/venkidev21)**
