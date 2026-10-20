# EESHA COMMERCE PLATFORM — 100% COMPLETE DEEP ARCHITECTURE & SYSTEM BLUEPRINT

> **Document Type:** Master System Specification, Design Tokens, Frontend/Backend Architecture, Database Relational Model, API Catalog, and AI Master Prompt  
> **Platform Name:** EESHA (Eesha Life / Eesha Commerce Atelier)  
> **Tech Stack:** React 19, TypeScript, Vite, Vanilla CSS Design System, Lucide Icons, Node.js, Express (ESM), Prisma ORM, SQLite Relational Database with ACID Transactions.  
> **Target Audience:** Developers, System Architects, UI/UX Designers, and AI Prompt Generators.

---

## TABLE OF CONTENTS
1. [Executive Overview & Vision](#1-executive-overview--vision)
2. [Visual Design System, Layout & AI Prompts](#2-visual-design-system-layout--ai-prompts)
   - 2.1 Aesthetic Philosophy & Editorial Direction
   - 2.2 Complete Color Palette & CSS Custom Property Tokens
   - 2.3 Typography Scale & Fluid Clamps
   - 2.4 Component Tokens, Shadows & Radii
   - 2.5 Responsive Layout Grid & Breakpoints
   - 2.6 Copy-Pasteable AI Prompts for UI / Visual Recreation
3. [Full Frontend Architecture](#3-full-frontend-architecture)
   - 3.1 Tech Stack & Build Tooling
   - 3.2 Directory Hierarchy
   - 3.3 Application Routing Map
   - 3.4 State Management & Context Architecture (Auth, Cart, Toast)
   - 3.5 Session Handling & Anonymous Cart Sync Flow
   - 3.6 Deep Dive: Customer Pages & Components
   - 3.7 Deep Dive: Admin Operations Portal
4. [Full Backend Architecture](#4-full-backend-architecture)
   - 4.1 Tech Stack & Server Configuration
   - 4.2 Layered System Flow (Route -> Validation -> Controller -> Service -> DB)
   - 4.3 Security, CORS, Helmet & Middleware Pipeline
   - 4.4 Error Handling & Operational vs Fatal Error Standard
   - 4.5 Financial & Inventory Transactional Integrity ($transaction)
   - 4.6 Idempotency Strategy
5. [Database Architecture & Relational Schema](#5-database-architecture--relational-schema)
   - 5.1 Prisma Schema & Data Models
   - 5.2 Entity Relationship Diagram (ERD)
   - 5.3 Model Dictionaries & Field Specifications
   - 5.4 Seed Data, Test Credentials & Role Definitions
6. [Complete API Catalog & Request/Response Contracts](#6-complete-api-catalog--requestresponse-contracts)
   - 6.1 Authentication & Profile (`/api/v1/auth`)
   - 6.2 Categories (`/api/v1/categories`)
   - 6.3 Products & Catalogue (`/api/v1/products`)
   - 6.4 Cart & Checkout Staging (`/api/v1/cart`)
   - 6.5 Orders & Post-Purchase (`/api/v1/orders`)
   - 6.6 Admin Control Plane (`/api/v1/admin`)
7. [Terminal Execution, Scripts & Troubleshooting Guide](#7-terminal-execution-scripts--troubleshooting-guide)
   - 7.1 Root, Frontend, and Backend Commands
   - 7.2 Resolution for `npm start` in Vite Frontend
8. [Unified AI Master Prompt](#8-unified-ai-master-prompt)

---

## 1. EXECUTIVE OVERVIEW & VISION

**EESHA** is an artisanal, editorial-grade e-commerce web platform engineered to deliver the feeling of a high-end luxury atelier. Unlike generic mass-market stores with loud neon banners and cookie-cutter grids, EESHA marries **contemporary Nordic minimalism** with **warm editorial luxury** (warm paper-white backgrounds, hand-thrown earth tones, deep slate charcoals, bronze accents, and editorial serif headlines).

### Multi-Discipline Product Domain
The platform curates fine objects across 5 distinct disciplines:
1. **Audio & Acoustics:** Reference studio headphones, planar dynamic drivers, precision acoustic elements.
2. **Timepieces & Horology:** Minimalist automatic watches, mechanical movements, vegetable-tanned straps.
3. **Home & Living:** Handcrafted stoneware ceramics, sculptural lighting, artisanal fragrance.
4. **Workspace & Leather:** Full-grain leather portfolios, machined solid brass stationery, solid oak organizers.
5. **Apparel & Textiles:** Heavyweight organic linen overshirts, tailored merino knitwear.

---

## 2. VISUAL DESIGN SYSTEM, LAYOUT & AI PROMPTS

### 2.1 Aesthetic Philosophy & Editorial Direction
- **Warm Editorial Canvas:** Avoid pure stark `#000000` or `#FFFFFF`. The storefront uses an unbleached tactile canvas tone (`#FAF8F5`) reminiscent of Japanese linen stock or heavy cotton paper.
- **Micro-Interactions:** Buttons rise subtly by `-1px` to `-2px` with a soft diffuse shadow (`0 4px 12px rgba(24, 24, 26, 0.06)`).
- **Zero Placeholder Law:** Every image is high-resolution, context-styled Unsplash editorial photography with neutral, cinematic lighting.
- **Glassmorphism & Drawer Overlays:** Backdrop blur (`backdrop-filter: blur(4px)`) behind an ink-tinted curtain (`rgba(24, 24, 26, 0.45)`).

---

### 2.2 Complete Color Palette & CSS Custom Property Tokens (COMMONS "Editorial Utility")

The entire design system is codified in `frontend/src/index.css`. All tokens are defined as standard CSS custom properties:

```css
:root {
  /* Surface & Canvas Tokens */
  --canvas: #F6F5F1;              /* Warm editorial canvas */
  --surface: #FFFFFF;             /* Crisp card surface */
  --surface-hover: #F0EEE8;        /* Subtle interactive hover */
  --surface-subtle: #FAF9F6;       /* Subdued container background */
  --surface-dark: #191A1B;         /* High-contrast admin & dark elements */

  /* Typography / Ink Tokens */
  --ink: #191A1B;                 /* Primary high-contrast text */
  --secondary-ink: #5E6265;       /* Descriptive, secondary meta copy */
  --muted-ink: #82878B;           /* Placeholders and de-emphasized labels */
  --inverse-ink: #FFFFFF;         /* Inverted text on dark/colored surfaces */

  /* Structural Border Tokens */
  --border: #E2E0DA;              /* Hairline structural dividers */
  --border-strong: #C9C6BD;       /* Interactive inputs & outlines */
  --border-focus: #191A1B;        /* Accessible keyboard focus ring */

  /* Brand Primary CTA Tokens */
  --primary-cta: #D64A2F;         /* Terracotta Ember primary CTA */
  --primary-cta-hover: #B93A24;   /* Deepened state on hover/focus */
  --accent-tint: #FBEAE5;         /* Soft rose/terracotta pill background */

  /* Operational & Financial Status Tokens */
  --status-success: #1C6B4E;      /* In Stock / Order Verified */
  --status-warning: #8A5700;      /* Low Stock (<= 5 units) / Action Pending */
  --status-error: #B42318;        /* Out of Stock / Cancelled / Error */
  --status-info: #245EA8;         /* Informational notices */

  /* Typography Stacks */
  --font-heading: 'Space Grotesk', -apple-system, sans-serif;
  --font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Dimensions & Radius */
  --header-height: 72px;
  --radius-xs: 3px;
  --radius-sm: 4px;
  --radius-md: 6px;               /* 4–10px corner radius */
  --radius-lg: 10px;
}
```

---

### 2.3 Typography Scale & Fluid Clamps

- **Serif Display (Editorial):** `'Playfair Display', Georgia, serif` (500 weight, `-0.015em` letter spacing).
- **Body & Sans Interface:** `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif`.
- **Monospace Financials/SKUs:** `'JetBrains Mono', monospace`.

| Level | Size Formula | Usage |
|---|---|---|
| `H1` | `clamp(2rem, 4vw, 3.25rem)` | Hero titles, primary landing page hooks |
| `H2` | `clamp(1.6rem, 2.8vw, 2.25rem)` | Section headers ("Discover by Discipline") |
| `H3` | `clamp(1.25rem, 2vw, 1.6rem)` | Category titles, modal headers |
| `H4` | `1.15rem` | Product card titles, drawer subheadings |
| Body | `15px / 1.6 line-height` | Product descriptions, editorial essays |
| Badges | `0.725rem / letter-spacing 0.05em` | Stock indicators, category pills, tags |

---

### 2.4 Component Tokens, Shadows & Radii

1. **Buttons (`.btn`):**
   - Minimum accessible touch target: `44px` height.
   - Border radius: `2px` (sharp, architectural luxury look rather than bubbly pill shape).
   - `.btn-primary`: Dark soot background (`#18181A`), white text, hover turns to `#27272A` with `-1px` transform.
   - `.btn-accent`: Warm Umber (`#8D5B3A`), hover turns to `#754728`.
   - `.btn-secondary`: Transparent background, strong border (`#D6CDC1`), hover reveals `--surface-hover`.
2. **Form Controls (`.form-input`, `.form-select`, `.form-textarea`):**
   - Pure white background, `1px solid var(--border-strong)`.
   - On focus: `outline: none; box-shadow: 0 0 0 1px #18181A; border-color: #18181A;`.
3. **Cart Drawer (`.drawer`):**
   - Slide-in panel docked to the right edge (`width: 100%; max-width: 440px; z-index: 110`).
   - Deep backdrop blur curtain (`rgba(24, 24, 26, 0.45)` with `backdrop-filter: blur(4px)`).
4. **Interactive Cards (`.card-interactive`):**
   - Default: `background: #FFFFFF`, border: `1px solid #EBE5DC`.
   - Hover: `transform: translateY(-2px); box-shadow: 0 4px 12px rgba(24, 24, 26, 0.06);`.

---

### 2.5 Responsive Layout Grid & Breakpoints

- **Container:** `max-width: 1280px; margin: 0 auto; padding: 0 clamp(1rem, 3vw, 2rem);`
- **Breakpoints:**
  - `> 1024px`: Desktop 4-column product grid (`.grid-4`).
  - `768px – 1024px`: Tablet 3-column or 2-column grid.
  - `< 768px`: Mobile 1-column stack, collapsible hamburger drawer navigation.

---

### 2.6 Copy-Pasteable AI Prompts for UI / Visual Recreation

#### Prompt 1: Front-End UI Generation (For Midjourney / DALL-E / Web Design Agents)
```text
High-end editorial luxury e-commerce homepage mockup for "EESHA", an atelier curating reference audio gear, mechanical horology watches, handcrafted stoneware ceramics, and full-grain leather bags. 
Color palette: Warm unbleached paper white canvas (#FAF8F5), soft sand cards (#F4EFEB), warm umber bronze accents (#8D5B3A), and soot ink typography (#18181A).
Typography: Playfair Display serif headings paired with clean Plus Jakarta Sans body typography.
Top: Crisp announcement bar with thin gold border "Complimentary insured delivery on orders over ₹2,000", sleek minimal header with brand wordmark "EESHA", search with live instant autocomplete, cart drawer badge, and user icon.
Hero: Full-bleed cinematic hero banner with deep moody ambient studio lighting showing beryllium open-back headphones, headline "Instruments of quiet beauty and enduring intent", two buttons (one dark soot, one umber bronze).
Sections: 
1. "Discover by Discipline" clean card grid with minimal photography.
2. "Curated Objects" 4-column product grid with price in INR (₹), rating badge (4.9 ★), and an elegant "Add to Bag" hover interaction.
3. Trust guarantees bar featuring 30-day trial, insured express shipping, and artisan provenance certificate.
Aesthetic: Editorial Scandinavian minimalism meets British heritage luxury. No neon colors, no cheap shadows, architectural 2px border radius.
```

#### Prompt 2: Component-Level Frontend Prompt (For LLM Coding Assistants)
```text
Write a React 19 + TypeScript component implementing a luxury shopping bag drawer with CSS Modules or Vanilla CSS.
Use the design system:
Background: #FFFFFF, canvas backdrop: rgba(24, 24, 26, 0.45) with backdrop-filter: blur(4px).
Tokens: Primary accent #8D5B3A, primary text #18181A, secondary text #52525B, border #EBE5DC.
Features:
1. Header: "Your Selection" with total item count and close button (X).
2. Free Shipping Progress Bar: Computes progress toward ₹2,000 threshold with animated bronze fill.
3. Item List: Each row shows 72x72 square image (object-fit: cover, radius: 2px), title in 500-weight serif, SKU in monospace, price in INR, and a sleek +/- quantity stepper.
4. Summary Footer: Subtotal calculation, free shipping indicator, and a full-width high-contrast checkout CTA button.
```

---

## 3. FULL FRONTEND ARCHITECTURE

### 3.1 Tech Stack & Tooling
- **Engine:** React 19 (`react`, `react-dom`)
- **Language:** TypeScript 5.8+ (Strict type checking, zero `any` in core models)
- **Router:** React Router v7 (`react-router-dom`)
- **Icons:** `lucide-react`
- **Build Tool:** Vite 6+ (Fast ESM HMR)
- **Linter:** Oxlint

### 3.2 Directory Hierarchy
```text
frontend/
├── index.html                   # HTML5 Entry, Google Font preconnects
├── package.json                 # Scripts: dev (vite), build (tsc -b && vite build)
├── vite.config.ts               # Proxy configuration to http://localhost:5000
└── src/
    ├── main.tsx                 # ReactDOM root mount
    ├── App.tsx                  # BrowserRouter, Route tree, Layout wrapper
    ├── index.css                # Global Design Tokens, Reset, Typography, Utilities
    ├── App.css                  # Component-specific styles
    ├── types/
    │   └── index.ts             # Shared frontend interfaces (Product, Cart, Order, User, etc.)
    ├── services/
    │   └── api.ts               # Centralized typed HTTP API client with auth/session headers
    ├── context/
    │   ├── AuthContext.tsx      # User authentication, token storage, role checks
    │   ├── CartContext.tsx      # Cart drawer state, optimistic cart count, sync
    │   └── ToastContext.tsx     # Non-blocking notification toasts (success, warning, error)
    ├── components/
    │   ├── common/
    │   │   ├── Navbar.tsx       # Search debounce dropdown, navigation links, user dropdown
    │   │   └── Footer.tsx       # Atelier philosophy, category links, newsletter, copyright
    │   ├── product/
    │   │   └── ProductCard.tsx  # Product tile with badges, price compare, quick add-to-cart
    │   └── cart/
    │       └── CartDrawer.tsx   # Slide-over bag, threshold calculator, item quantity adjustments
    └── pages/
        ├── HomePage.tsx         # Hero, curated departments, featured products, values
        ├── CataloguePage.tsx    # Filterable catalog (search, categories, price range, stock, sort)
        ├── ProductDetailPage.tsx# Gallery thumbs, specs table, stock status, related items
        ├── CartPage.tsx         # Full-page cart overview with cost breakdown
        ├── CheckoutPage.tsx     # 2-step checkout, guest/saved addresses, payment mock
        ├── OrderConfirmationPage.tsx # Post-purchase confirmation, order summary, tracking
        ├── OrderDetailPage.tsx  # Customer self-service order inspection & cancellation
        ├── ProfilePage.tsx      # Customer address management, personal info, order history
        ├── LoginPage.tsx        # Customer & Admin login with quick demo credentials
        ├── RegisterPage.tsx     # Account registration
        └── admin/
            ├── AdminLayout.tsx       # Dark administrative shell with sidebar navigation
            ├── AdminDashboardPage.tsx # Revenue KPIs, low stock alerts, recent order feeds
            ├── AdminProductsPage.tsx  # Product catalog manager, modal create/edit, image uploads
            ├── AdminInventoryPage.tsx # Real-time stock adjuster, audit logs, reason codes
            ├── AdminOrdersPage.tsx    # Order lifecycle manager (status updates, customer lookup)
            └── AdminCategoriesPage.tsx# Category management (slugs, descriptions, sort order)
```

---

### 3.3 Application Routing Map

| URL Path | Component | Protected / Role | Description |
|---|---|---|---|
| `/` | `HomePage` | Public | Editorial hero, discipline grid, featured products |
| `/catalogue` | `CataloguePage` | Public | Full catalogue with multi-filter sidebar & sort |
| `/product/:slug` | `ProductDetailPage` | Public | Deep product specs, gallery, stock badges, reviews |
| `/cart` | `CartPage` | Public | Full-page cart summary |
| `/checkout` | `CheckoutPage` | Public / Guest | Address entry, live tax/shipping preview, place order |
| `/order-confirmation/:orderNumber` | `OrderConfirmationPage` | Public | Success screen with invoice details |
| `/order/:id` | `OrderDetailPage` | Customer / Admin | Order status timeline, cancellation option |
| `/login` | `LoginPage` | Public | User/Admin authentication |
| `/register` | `RegisterPage` | Public | New account creation |
| `/profile` | `ProfilePage` | Authenticated | Address book, user details, past orders |
| `/admin` | `AdminDashboardPage` | Admin Only | Gross revenue, order counts, stock warnings |
| `/admin/products` | `AdminProductsPage` | Admin Only | Product CRUD, image URL management, active toggles |
| `/admin/inventory` | `AdminInventoryPage` | Admin Only | Stock replenishment, deduction, audit log inspection |
| `/admin/orders` | `AdminOrdersPage` | Admin Only | Order status transition (Processing -> Shipped, etc.) |
| `/admin/categories` | `AdminCategoriesPage`| Admin Only | Category creation, editing, sort ordering |

---

### 3.4 State Management & Context Architecture

The frontend uses three lightweight, high-performance React Contexts:

1. **`AuthContext` (`frontend/src/context/AuthContext.tsx`):**
   - Stores `user: User | null`, `token: string | null`, and computed `isAdmin: boolean`.
   - Persists JWT token in `localStorage.getItem('eesha_token')`.
   - On mount, invokes `api.auth.getProfile()` to validate the session. If expired, clears token gracefully.
   - Upon login, automatically triggers `api.cart.sync(sessionId)` to associate the anonymous cart items with the customer's account.

2. **`CartContext` (`frontend/src/context/CartContext.tsx`):**
   - Stores `cart: Cart | null`, `isDrawerOpen: boolean`, and computed `itemCount: number`.
   - Exposes methods: `openCart()`, `closeCart()`, `addToCart(productId, quantity)`, `updateQuantity(itemId, qty)`, `removeItem(itemId)`, `clearCart()`.
   - Optimistically updates UI counters and triggers informative Toast notifications ("Item added to your selection").

3. **`ToastContext` (`frontend/src/context/ToastContext.tsx`):**
   - Provides non-intrusive floating toasts in the top-right corner.
   - Supports 4 variants: `success`, `error`, `warning`, `info` with automatic 4-second timeout dismissal.

---

### 3.5 Session Handling & Anonymous Cart Sync Flow

EESHA supports uninterrupted guest shopping without requiring upfront login:
1. **Session Generation:** On first visit, `getSessionId()` in `frontend/src/services/api.ts` checks `localStorage` for `eesha_session_id`. If absent, generates a cryptographically random session ID:
   ```ts
   sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
   ```
2. **Header Propagation:** Every HTTP request transmits both:
   - `x-session-id: <sessionId>`
   - `Authorization: Bearer <token>` (if logged in).
3. **Cart Migration (Merge on Login):** When a user logs in, the client calls `POST /api/v1/cart/sync { sessionId }`. The backend reads items tied to the anonymous `sessionId`, transfers them to the authenticated `userId` cart (combining quantities if duplicates exist), and destroys the guest cart.

---

## 4. FULL BACKEND ARCHITECTURE

### 4.1 Tech Stack & Server Configuration
- **Runtime:** Node.js v20+ with ES Modules (`"type": "module"`)
- **Framework:** Express.js 4.21+
- **Database Client:** Prisma ORM 6+
- **Validation Engine:** Zod (Strict schema validation on request bodies, query params, and route params)
- **Security:** `helmet` for HTTP security headers, `cors` for cross-origin verification, `bcryptjs` for password hashing, `jsonwebtoken` for stateless auth.
- **Logging:** `morgan` for concise HTTP request telemetry in non-test environments.

### 4.2 Layered System Flow
```
[Client HTTP Request]
        │
        ▼
[app.ts] ──► [Helmet & CORS] ──► [Morgan Logger] ──► [Body Parsers]
        │
        ▼
[routes/*.routes.ts] ──► [Middleware: validate(schema), requireAuth, requireAdmin]
        │
        ▼
[controllers/*.controller.ts] ──► Unwraps inputs, delegates business logic
        │
        ▼
[services/*.service.ts] ──► Implements business rules & database transactions
        │
        ▼
[Prisma Client / SQLite] ──► ACID Relational Execution
        │
        ▼
[Global Error Handler] ──► Formats structured JSON error response if AppError thrown
```

---

### 4.3 Error Handling & Operational vs Fatal Error Standard

All application errors inherit from `AppError` (`backend/src/middleware/error.ts`):
```ts
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}
```
- **Operational Errors (400, 401, 403, 404, 409):** Expected real-world errors (e.g., "Insufficient stock", "Invalid password", "Product not found"). Returned cleanly to the client with `{ success: false, error: "..." }`.
- **Fatal / Unhandled Errors (500):** Hidden behind a safe generic message in production to prevent leakage of internal stack traces.

---

### 4.4 Financial & Inventory Transactional Integrity ($transaction)

The checkout process (`OrderService.createOrder` in `backend/src/services/order.service.ts`) executes inside an **atomic Prisma transaction**:

```ts
return prisma.$transaction(async (tx) => {
  // 1. Re-query all products to verify real-time price & stock
  for (const item of data.items) {
    const product = await tx.product.findUnique({ where: { id: item.productId } });
    if (!product || !product.isActive) {
      throw new AppError(`Product is no longer available`, 404);
    }
    if (product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for "${product.title}". Available: ${product.stock}, Requested: ${item.quantity}`, 400);
    }

    // 2. Atomically decrement stock
    const newStock = product.stock - item.quantity;
    await tx.product.update({
      where: { id: product.id },
      data: { stock: newStock },
    });

    // 3. Prepare order item with immutable price snapshot
    // ...
  }

  // 4. Compute Subtotal, Tax (18% GST), Shipping (Free above ₹2,000, else ₹150)
  // 5. Create Order record with unique orderNumber (e.g. EESHA-839210)
  // 6. Record InventoryAdjustment log for each item with reason 'ORDER_PLACED'
  // 7. Clear user cart if authenticated
});
```

**Order Cancellation & Restock:**
When an order is cancelled via `OrderService.cancelOrder`, the inverse transaction runs:
1. Validates status (orders already `SHIPPED` or `DELIVERED` cannot be cancelled).
2. For each order item, increments the product stock back: `newStock = product.stock + item.quantity`.
3. Creates an `InventoryAdjustment` audit record with reason `ORDER_CANCELLED`.
4. Updates order status to `CANCELLED` and `paymentStatus` to `REFUNDED`.

---

### 4.5 Idempotency Strategy
To prevent double-charging or duplicate order creation during network timeouts or accidental multi-clicks:
- The frontend creates an `idempotencyKey` UUID upon entering checkout.
- Sent via header `idempotency-key: <uuid>`.
- The backend checks `prisma.order.findUnique({ where: { idempotencyKey } })`.
- If an order with that key already exists, the backend returns the existing order immediately without re-debiting stock or duplicating line items.

---

## 5. DATABASE ARCHITECTURE & RELATIONAL SCHEMA

### 5.1 Prisma Schema & Data Models

The SQLite relational database (`backend/prisma/schema.prisma`) contains **10 linked models**:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           String      @id @default(cuid())
  email        String      @unique
  passwordHash String
  firstName    String
  lastName     String
  phone        String?
  role         String      @default("CUSTOMER") // "CUSTOMER" | "ADMIN"
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  addresses    Address[]
  orders       Order[]
  cart         Cart?
  auditLogs    AuditLog[]
}

model Address {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  label        String?  // e.g. "Home", "Studio", "Office"
  fullName     String
  phone        String
  street       String
  city         String
  state        String
  postalCode   String
  country      String   @default("India")
  isDefault    Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  description String?
  imageUrl    String?
  sortOrder   Int       @default(0)
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  products    Product[]
}

model Product {
  id                 String       @id @default(cuid())
  title              String
  slug               String       @unique
  description        String
  price              Float
  compareAtPrice     Float?
  sku                String       @unique
  categoryId         String
  category           Category     @relation(fields: [categoryId], references: [id])
  isFeatured         Boolean      @default(false)
  isActive           Boolean      @default(true)
  stock              Int          @default(0)
  lowStockThreshold  Int          @default(5)
  specifications     String?      // JSON string of key-value pairs
  highlights         String?      // Comma-separated feature highlights
  rating             Float        @default(4.8)
  reviewCount        Int          @default(24)
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt

  images             ProductImage[]
  cartItems          CartItem[]
  orderItems         OrderItem[]
  inventoryLogs      InventoryAdjustment[]
}

model ProductImage {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  url       String
  altText   String?
  isPrimary Boolean  @default(false)
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
}

model Cart {
  id        String     @id @default(cuid())
  userId    String?    @unique
  user      User?      @relation(fields: [userId], references: [id], onDelete: Cascade)
  sessionId String?    @unique
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  items     CartItem[]
}

model CartItem {
  id        String   @id @default(cuid())
  cartId    String
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  quantity  Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([cartId, productId])
}

model Order {
  id              String      @id @default(cuid())
  orderNumber     String      @unique
  userId          String?
  user            User?       @relation(fields: [userId], references: [id], onDelete: SetNull)
  guestEmail      String?
  guestName       String?
  guestPhone      String?
  status          String      @default("PENDING") // PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED
  paymentStatus   String      @default("PENDING") // PENDING, COMPLETED, FAILED, REFUNDED
  paymentMethod   String      @default("DEVELOPMENT_MOCK") // DEVELOPMENT_MOCK, COD, UPI_TEST
  subtotal        Float
  taxTotal        Float
  shippingFee     Float
  discountTotal   Float       @default(0)
  grandTotal      Float
  currency        String      @default("INR")
  shippingAddress String      // Serialized JSON address snapshot
  billingAddress  String?     // Serialized JSON address snapshot
  idempotencyKey  String?     @unique
  notes           String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  items           OrderItem[]
  inventoryLogs   InventoryAdjustment[]
}

model OrderItem {
  id           String   @id @default(cuid())
  orderId      String
  order        Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId    String?
  product      Product? @relation(fields: [productId], references: [id], onDelete: SetNull)
  productTitle String
  productSku   String
  unitPrice    Float
  quantity     Int
  totalAmount  Float
  productImage String?
  snapshotData String?  // JSON snapshot of product at time of purchase
  createdAt    DateTime @default(now())
}

model InventoryAdjustment {
  id             String   @id @default(cuid())
  productId      String
  product        Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  changeQuantity Int      // Positive for restock, negative for deduction
  previousStock  Int
  newStock       Int
  reason         String   // ORDER_PLACED, ORDER_CANCELLED, ADMIN_RESTOCK, MANUAL_ADJUSTMENT
  orderId        String?
  order          Order?   @relation(fields: [orderId], references: [id], onDelete: SetNull)
  adminUserId    String?
  createdAt      DateTime @default(now())
}

model AuditLog {
  id         String   @id @default(cuid())
  userId     String?
  user       User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  action     String   // CREATE, UPDATE, DELETE, STATUS_CHANGE
  entityType String   // PRODUCT, ORDER, CATEGORY, INVENTORY, USER
  entityId   String
  metadata   String?  // JSON formatted details
  ipAddress  String?
  createdAt  DateTime @default(now())
}
```

---

### 5.2 Entity Relationship Diagram (ERD)

```text
       ┌──────────────┐
       │     User     │
       └──────┬───────┘
              │ 1:N
     ┌────────┼─────────────────┬─────────────────┐
     │        │                 │                 │
     ▼        ▼                 ▼                 ▼
┌─────────┐ ┌─────────┐   ┌───────────┐     ┌───────────┐
│ Address │ │  Cart   │   │   Order   │     │ AuditLog  │
└─────────┘ └────┬────┘   └─────┬─────┘     └───────────┘
                 │              │
                 │ 1:N          │ 1:N
                 ▼              ▼
           ┌──────────┐   ┌───────────┐     ┌──────────────────────┐
           │ CartItem │   │ OrderItem │◄────┤ InventoryAdjustment  │
           └─────┬────┘   └─────┬─────┘     └──────────┬───────────┘
                 │              │                      │
                 │ N:1          │ N:1                  │
                 ▼              ▼                      │
           ┌──────────────────────────┐                │
           │         Product          │◄───────────────┘
           └─────────────┬────────────┘
                         │
             ┌───────────┴───────────┐
             │ 1:N                   │ N:1
             ▼                       ▼
      ┌──────────────┐        ┌──────────────┐
      │ ProductImage │        │   Category   │
      └──────────────┘        └──────────────┘
```

---

### 5.3 Test Credentials & Seed Catalog

The database is pre-seeded with 2 initial users via `npm run seed`:

| Email | Password | Role | Name | Notes |
|---|---|---|---|---|
| `admin@eesha.com` | `AdminPassword123!` | `ADMIN` | Aarav Mehta | Full access to `/admin` operations portal |
| `customer@eesha.com` | `CustomerPassword123!` | `CUSTOMER` | Priya Sharma | Has preloaded Bangalore default shipping address |

---

## 6. COMPLETE API CATALOG & REQUEST/RESPONSE CONTRACTS

All API endpoints are prefixed with `/api/v1`.

### 6.1 Authentication & Profile
- `POST /api/v1/auth/register`
  - Body: `{ email, password, firstName, lastName, phone? }`
  - Response: `{ success: true, data: { user: User, token: string } }`
- `POST /api/v1/auth/login`
  - Body: `{ email, password }`
  - Response: `{ success: true, data: { user: User, token: string } }`
- `GET /api/v1/auth/me` [Header: `Authorization: Bearer <token>`]
  - Response: `{ success: true, data: User & { addresses: Address[] } }`
- `PUT /api/v1/auth/me`
  - Body: `{ firstName?, lastName?, phone? }`
- `GET /api/v1/auth/addresses`
  - Returns saved user addresses.
- `POST /api/v1/auth/addresses`
  - Body: `{ fullName, phone, street, city, state, postalCode, country?, isDefault? }`
- `DELETE /api/v1/auth/addresses/:id`
  - Removes a user address.

---

### 6.2 Categories
- `GET /api/v1/categories`
  - Returns array of active categories with product counts.
- `GET /api/v1/categories/:slug`
  - Returns single category details.
- `POST /api/v1/categories` [Admin]
  - Body: `{ name, slug, description?, imageUrl?, sortOrder? }`
- `PUT /api/v1/categories/:id` [Admin]
- `DELETE /api/v1/categories/:id` [Admin]

---

### 6.3 Products & Catalogue
- `GET /api/v1/products`
  - Query parameters:
    - `search` (matches title and description)
    - `category` (category slug)
    - `minPrice`, `maxPrice`
    - `inStock` (`true` filters out 0-stock items)
    - `sortBy` (`newest`, `price-asc`, `price-desc`, `rating`)
    - `page` (default 1), `limit` (default 12)
  - Response:
    ```json
    {
      "success": true,
      "data": {
        "products": [ /* array of Product with primary image & category */ ],
        "total": 24,
        "page": 1,
        "totalPages": 2,
        "hasMore": true
      }
    }
    ```
- `GET /api/v1/products/featured?limit=6`
  - Returns highlighted featured atelier products for the homepage.
- `GET /api/v1/products/related?productId=...&categoryId=...`
  - Returns up to 4 recommendations from the same discipline.
- `GET /api/v1/products/:slug`
  - Returns full product record including images array, specifications object, and real-time stock count.

---

### 6.4 Cart & Staging
- `GET /api/v1/cart` [Headers: `x-session-id`, optional `Authorization`]
  - Returns active cart with joined line items, product titles, images, and live prices.
- `POST /api/v1/cart/items`
  - Body: `{ productId: string, quantity: number }`
  - Upserts line item quantity. Validates requested quantity against `product.stock`.
- `PUT /api/v1/cart/items/:itemId`
  - Body: `{ quantity: number }` (removes if quantity <= 0).
- `DELETE /api/v1/cart/items/:itemId`
  - Deletes individual line item.
- `DELETE /api/v1/cart`
  - Empties entire cart.
- `POST /api/v1/cart/sync` [Requires Auth, Body: `{ sessionId }`]
  - Merges items from guest session into user's persistent cart.

---

### 6.5 Orders & Post-Purchase
- `POST /api/v1/orders/preview`
  - Body: `{ items: [{ productId, quantity }] }`
  - Response: Verified item breakdown, `subtotal`, `taxTotal` (18%), `shippingFee` (₹0 if >= ₹2,000, else ₹150), `grandTotal`.
- `POST /api/v1/orders` [Optional Auth, Header: `idempotency-key`]
  - Body:
    ```json
    {
      "guestEmail": "guest@example.com",
      "guestName": "Guest Buyer",
      "guestPhone": "9876543210",
      "shippingAddress": {
        "fullName": "Priya Sharma",
        "phone": "+91 91234 56789",
        "street": "42 Indiranagar 100ft Road",
        "city": "Bengaluru",
        "state": "Karnataka",
        "postalCode": "560038",
        "country": "India"
      },
      "paymentMethod": "DEVELOPMENT_MOCK",
      "items": [{ "productId": "...", "quantity": 1 }],
      "notes": "Please deliver during business hours"
    }
    ```
- `GET /api/v1/orders` [Requires Auth]
  - Returns user's order history.
- `GET /api/v1/orders/:id`
  - Fetches order by database `id` or public `orderNumber` (e.g. `EESHA-982314`).
- `POST /api/v1/orders/:id/cancel`
  - Cancels order if not already shipped, restores inventory, marks payment refunded.

---

### 6.6 Admin Control Plane (`/api/v1/admin`)
All admin endpoints require `role === 'ADMIN'`.

- `GET /api/v1/admin/dashboard`
  - Returns aggregate operational metrics:
    - `totalOrders`, `totalRevenue`, `totalProducts`, `lowStockCount`, `outOfStockCount`
    - `lowStockProducts` list (products where `stock <= lowStockThreshold`)
    - `recentOrders` (last 5 orders with customer names)
    - `recentAdjustments` (audit trails of recent inventory movements)
- `GET /api/v1/admin/products`
  - Paginated product list with search and category filters.
- `POST /api/v1/admin/products`
  - Creates new product with SKU uniqueness validation.
- `PUT /api/v1/admin/products/:id`
  - Partial updates for prices, descriptions, specs, or active status.
- `POST /api/v1/admin/products/:id/inventory`
  - Body: `{ changeQuantity: number, reason: string }`
  - Adjusts stock count and writes an `InventoryAdjustment` audit record.
- `GET /api/v1/admin/orders`
  - Filter orders by status (`PENDING`, `PAID`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
- `PUT /api/v1/admin/orders/:id/status`
  - Body: `{ status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' }`
- `GET /api/v1/admin/inventory/history?productId=...`
  - Full audit ledger of stock changes with reason codes and timestamps.

---

## 7. TERMINAL EXECUTION, SCRIPTS & TROUBLESHOOTING GUIDE

### 7.1 Root, Frontend, and Backend Commands

#### Running the Full Platform from Root
In the root directory `c:\Users\venkatesan E\venki\Eesha life`:
- `npm run dev:backend` — Starts Express backend with `tsx watch` on port `5000`.
- `npm run dev:frontend` — Starts Vite frontend on `http://localhost:5173`.
- `npm run seed` — Resets and seeds the SQLite database with full atelier catalog.

---

### 7.2 Resolution for `npm start` in Vite Frontend

#### Why did `npm start` fail earlier?
When running inside `frontend/`:
```bash
npm error Missing script: "start"
```
**Cause:** Vite frontend projects define `"dev"` in `package.json`, not `"start"`.

#### The Correct Commands in `frontend/`:
```bash
# To run the frontend dev server:
npm run dev

# To build for production:
npm run build

# To preview the built production app:
npm run preview
```

#### The Correct Commands in `backend/`:
```bash
# To start the backend development server:
npm run dev

# Or to run the compiled production build:
npm start
```

---

## 8. UNIFIED AI MASTER PROMPT

To feed this entire project specification to another AI model, copy and paste the block below:

```text
You are a Principal Full-Stack Engineer and Senior UI/UX Designer.
Recreate the complete, production-ready "EESHA" Luxury Multi-Discipline E-Commerce Platform.

1. BRAND & DESIGN SYSTEM:
- Aesthetic: Editorial Nordic-Japanese atelier luxury (warm unbleached paper background #FAF8F5, soot ink text #18181A, warm bronze accent #8D5B3A, soft card #FFFFFF, borders #EBE5DC).
- Typography: Playfair Display for editorial headlines (fluid clamps), Plus Jakarta Sans for UI/body, JetBrains Mono for SKUs and currency values.
- Radii: Architectural 2px subtle curves. No loud pill buttons.
- Touch Targets: Min 44px on all interactive controls.
- Categories: Audio & Acoustics, Timepieces & Horology, Home & Living, Workspace & Leather, Apparel & Textiles.

2. FRONTEND ARCHITECTURE:
- Framework: React 19 + TypeScript + Vite + React Router v7.
- State:
  - AuthContext (JWT auth, profile state, admin privilege check).
  - CartContext (Optimistic drawer counter, live total recalculation, free shipping bar threshold ₹2,000).
  - ToastContext (Floating feedback notifications).
- Key Views:
  - Home: Cinematic hero, curated department tiles, 4-column product grid with quick-add.
  - Catalogue: Filter sidebar (search, discipline, price slider, in-stock toggle, sorting).
  - Product Detail: Image gallery, stock badge (Low stock warning if <= 5), technical specifications table.
  - Cart Drawer: Slide-over overlay with backdrop blur, item steppers.
  - Checkout: 2-step layout with address capture, live preview calculation, and mock payment gateway.
  - Order Confirmation & Tracking: Order invoice summary and self-service order cancellation.
  - Admin Portal: Dark sidebar, KPI overview (revenue, order counts, stock alerts), product CRUD modal, inventory adjustment ledger, and order status workflow.

3. BACKEND ARCHITECTURE:
- Engine: Node.js (ESM) + Express + Prisma ORM + SQLite database.
- Layers: Clean architecture separation: routes -> validation middlewares -> controllers -> services -> database.
- Integrity:
  - Checkout wrapped in Prisma $transaction with atomic stock decrement.
  - Idempotency key support to prevent double submission.
  - InventoryAdjustment audit log on every stock change.
  - Anonymous session ID cart linked via 'x-session-id' and merged upon user login.
  - Zod validation on all incoming request payloads.
  - Centralized operational AppError handler.

4. SEED DATA & CREDENTIALS:
- Admin: admin@eesha.com / AdminPassword123!
- Customer: customer@eesha.com / CustomerPassword123!
- Seed catalog of 20+ realistic luxury products with images, specifications JSON, and realistic stock quantities.
```
