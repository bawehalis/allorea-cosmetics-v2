# Lumière Cosmetics — Full-Stack E-Commerce Platform

A production-ready luxury cosmetics e-commerce platform built with **Next.js 14**, **React**, **TailwindCSS**, **Prisma**, and **Stripe**.

---

## 🗂 Project Structure

```
lumiere-cosmetics/
├── prisma/
│   ├── schema.prisma          # Full database schema (14 models)
│   └── seed.ts                # Database seed with products, categories, admin user
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (store pages)      # Homepage, shop, product, cart, checkout
│   │   ├── account/           # Customer account + order history
│   │   ├── admin/             # Full admin dashboard
│   │   ├── api/               # REST API routes
│   │   ├── blog/              # Blog listing + article pages
│   │   ├── legal/             # Privacy, Terms, Shipping, Returns
│   │   ├── login/             # Auth login page
│   │   ├── track/             # Order tracking
│   │   └── wishlist/          # Customer wishlist
│   │
│   ├── components/
│   │   ├── admin/             # AdminShell, ProductForm, BlogForm, StatCard
│   │   ├── home/              # HeroBanner, CategoryGrid, FeaturedProducts, etc.
│   │   ├── layout/            # Header, Footer, CartDrawer
│   │   ├── shop/              # ProductCard, ShopFilters
│   │   └── ui/                # Badge, EmptyState, LoadingSpinner
│   │
│   ├── hooks/                 # useAuth, useCart, useProducts
│   ├── lib/                   # db, auth, stripe, email, validation, rate-limit
│   ├── middleware.ts           # Route protection + security headers
│   ├── store/                 # Zustand cart store (persisted)
│   └── types/                 # Full TypeScript definitions
│
├── public/
│   └── robots.txt
│
├── next.config.js             # Security headers, image optimization
├── tailwind.config.ts         # Brand design tokens
└── .env.example               # All required environment variables
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env.local
# Fill in DATABASE_URL, STRIPE keys, SMTP, JWT_SECRET
```

### 3. Set up database
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Admin panel:** [http://localhost:3000/admin](http://localhost:3000/admin)
- Email: `admin@lumiere-cosmetics.com`
- Password: `Admin@Lumiere123`

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React 18 + TailwindCSS |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (jose) + bcrypt |
| Payments | Stripe Checkout |
| Email | Nodemailer |
| State | Zustand (cart, persisted) |
| Validation | Zod |
| Forms | React Hook Form |
| Fonts | Cormorant Garamond + Jost (Google Fonts) |
| Deployment | Vercel (recommended) |

---

## 🛒 Features

### Storefront
- ✅ Animated hero carousel with 3 slides
- ✅ Category grid with hover effects
- ✅ Featured products + best sellers
- ✅ Promo banner with coupon code display
- ✅ Blog section with author + date
- ✅ Newsletter subscription with API
- ✅ Product detail with image gallery, reviews, related products
- ✅ Cart drawer with free-shipping progress bar
- ✅ Full cart page with coupon code input
- ✅ 3-step checkout (info → shipping → payment)
- ✅ Stripe payment integration
- ✅ Order confirmation page + email
- ✅ Order tracking page
- ✅ Customer account + order history
- ✅ Wishlist
- ✅ Shop with filters, sorting, grid/list layout

### Admin Dashboard
- ✅ Analytics dashboard with revenue chart
- ✅ Products CRUD with image management
- ✅ Orders management with status updates
- ✅ Customer database with spend tracking
- ✅ Coupon/discount management
- ✅ Blog post management
- ✅ Low-stock alerts

### Backend / API
- ✅ 20+ REST API routes
- ✅ JWT authentication with secure cookies
- ✅ Role-based access control (Customer / Admin / Super Admin)
- ✅ Stripe webhook handler
- ✅ Rate limiting (per-route)
- ✅ Zod input validation
- ✅ CSRF + XSS protection via security headers
- ✅ Prisma with 14 database models

### SEO
- ✅ Dynamic sitemap.xml
- ✅ robots.txt
- ✅ OpenGraph + Twitter Card meta tags
- ✅ Semantic HTML structure
- ✅ Next.js metadata API

---

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/lumiere"

# Auth
JWT_SECRET="change-this-in-production-min-32-chars"
NEXTAUTH_URL="https://yourdomain.com"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="noreply@yourdomain.com"
SMTP_PASS="your-app-password"

# App
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Optional: Cloudinary (image uploads)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login, returns JWT cookie |
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/logout` | Clear auth cookie |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List with filters, pagination |
| POST | `/api/products` | Create product (admin) |
| GET | `/api/products/[id]` | Get single product |
| PATCH | `/api/products/[id]` | Update product (admin) |
| DELETE | `/api/products/[id]` | Soft-delete (admin) |
| GET | `/api/products/[id]/reviews` | Get product reviews |
| POST | `/api/products/[id]/reviews` | Submit review |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders` | List orders (own or all for admin) |
| GET | `/api/orders/[id]` | Get order detail |
| PATCH | `/api/orders/[id]` | Update status (admin) |

### Checkout
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/checkout/session` | Create Stripe checkout session |
| POST | `/api/checkout/validate-coupon` | Validate a coupon code |
| POST | `/api/webhooks/stripe` | Stripe event webhook |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics` | Full analytics data |
| GET | `/api/customers` | Customer list |
| GET | `/api/inventory` | Low stock report |
| PATCH | `/api/inventory` | Bulk stock update |

---

## 🎨 Design System

**Fonts:** Cormorant Garamond (display) + Jost (body)

**Colours:**
- `brand` — warm terracotta/bronze (#bf6043)
- `nude` — soft beige scale
- `charcoal` — near-black (#1c1c1e)
- `pearl` — off-white (#faf9f7)

**Key CSS classes:**
- `.btn-primary` `.btn-outline` `.btn-brand` — buttons
- `.section-title` `.section-subtitle` — headings
- `.card-product` — product card wrapper
- `.input-field` — form inputs
- `.container-main` — max-width container
- `.page-section` — section padding
