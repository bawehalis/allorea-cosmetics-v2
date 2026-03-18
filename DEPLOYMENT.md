# Deployment Guide — Lumière Cosmetics

## Recommended Stack
- **Hosting:** Vercel (frontend + API routes)
- **Database:** Supabase PostgreSQL or PlanetScale
- **CDN/Images:** Cloudinary or Vercel Image Optimization
- **Email:** Gmail SMTP, SendGrid, or Resend
- **Payments:** Stripe Live

---

## 1. Vercel Deployment

### One-click deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual steps

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Environment variables on Vercel
Go to **Project → Settings → Environment Variables** and add all variables from `.env.example`.

---

## 2. Database Setup (Supabase)

```bash
# 1. Create project at supabase.com
# 2. Copy connection string from Settings → Database
# 3. Add to .env: DATABASE_URL="postgresql://..."

# 4. Run migrations
npx prisma db push

# 5. Seed production data
NODE_ENV=production npm run db:seed
```

---

## 3. Stripe Setup

### Create products & prices
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Listen for webhooks locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Webhook endpoint (production)
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy the **Signing Secret** → add as `STRIPE_WEBHOOK_SECRET`

---

## 4. Email Setup (Gmail)

```bash
# 1. Enable 2FA on Google account
# 2. Go to Google Account → Security → App Passwords
# 3. Generate password for "Mail"
# 4. Add to env:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-16-char-app-password
```

---

## 5. Image Uploads (Cloudinary)

```bash
# 1. Create account at cloudinary.com
# 2. Get credentials from Dashboard
# 3. Add to env:
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=secret

# 4. Uncomment Cloudinary code in src/app/api/upload/route.ts
# 5. Install: npm install cloudinary
```

---

## 6. Post-Deploy Checklist

- [ ] All environment variables set
- [ ] Database migrated and seeded
- [ ] Stripe webhook registered
- [ ] Custom domain configured
- [ ] SSL certificate active (automatic on Vercel)
- [ ] Admin password changed from default
- [ ] Test order placed end-to-end
- [ ] Email confirmation received
- [ ] Analytics loading correctly
- [ ] `robots.txt` accessible at `/robots.txt`
- [ ] Sitemap accessible at `/sitemap.xml`

---

## 7. Performance Checklist

- [ ] Images served in WebP/AVIF format via `next/image`
- [ ] Google Fonts loaded with `display: swap`
- [ ] Static pages pre-rendered where possible
- [ ] API routes rate-limited
- [ ] Prisma connection pooling configured (use `DATABASE_URL` with `?pgbouncer=true` on Supabase)

---

## 8. Scaling Considerations

### Rate Limiting
The current in-memory rate limiter works for single-instance deployments. For multi-instance production:

```bash
npm install @upstash/ratelimit @upstash/redis
# Replace src/lib/rate-limit.ts with Upstash implementation
```

### Session Storage
Replace in-memory JWT with Redis-backed sessions for scale:
```bash
npm install ioredis
# Configure REDIS_URL in env
```

### Image Optimization
For high traffic, move image optimization to a dedicated CDN:
```bash
# In next.config.js, set:
images: { loader: 'cloudinary', path: 'https://res.cloudinary.com/your-cloud/' }
```
