# Security Implementation — Lumière Cosmetics

## Overview

This document details all security measures implemented in this codebase.

---

## Authentication & Sessions

| Measure | Implementation |
|---|---|
| Password hashing | `bcryptjs` with cost factor 12 |
| Session tokens | HS256 JWT via `jose`, 7-day expiry |
| Cookie security | `httpOnly: true`, `secure: true` (prod), `sameSite: lax` |
| Token verification | Middleware validates on every `/admin` and auth-required route |
| Timing-safe compare | Dummy hash run even when user not found (prevents user enumeration) |

---

## API Security

| Measure | Implementation |
|---|---|
| Rate limiting | Per-route, per-IP limits (auth: 10/15min, api: 100/min) |
| Input validation | Zod schemas on all POST/PATCH endpoints |
| SQL injection | Prevented by Prisma ORM (parameterised queries) |
| XSS prevention | `sanitize()` utility + CSP headers |
| CSRF protection | `sameSite: lax` cookies + origin checking |
| Role-based access | `requireAuth()` / `requireAdmin()` guards on all sensitive routes |

---

## HTTP Security Headers

Set in `next.config.js` for all routes:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

---

## Payment Security

| Measure | Implementation |
|---|---|
| Card data | Never touches server — handled by Stripe.js |
| Webhook verification | `stripe.webhooks.constructEvent()` with signing secret |
| Order integrity | Stock reserved atomically on checkout session creation |
| Idempotency | Order status transitions validated server-side |

---

## Data Protection

| Measure | Implementation |
|---|---|
| Password storage | Bcrypt hash only — plaintext never stored |
| Sensitive env vars | Never exposed to client (`NEXT_PUBLIC_` prefix only for safe values) |
| User data isolation | Customers can only access their own orders/data |
| Admin separation | Separate role checks (`ADMIN`/`SUPER_ADMIN`) |

---

## Dependency Security

```bash
# Audit dependencies
npm audit

# Fix automatically where possible
npm audit fix

# Check for outdated packages
npm outdated
```

---

## Production Hardening Checklist

- [ ] Change default admin password immediately after deploy
- [ ] Set strong `JWT_SECRET` (min 32 random characters)
- [ ] Enable Vercel's DDoS protection
- [ ] Set up Stripe Radar rules for fraud prevention
- [ ] Enable database SSL (`?sslmode=require` in DATABASE_URL)
- [ ] Rotate API keys every 90 days
- [ ] Set up error monitoring (Sentry)
- [ ] Enable Vercel security headers scanning
- [ ] Configure CORS to your domain only
- [ ] Review and restrict Prisma query logs in production

---

## Reporting Vulnerabilities

Please report security vulnerabilities to: security@lumiere-cosmetics.com

Do not file public GitHub issues for security vulnerabilities.
