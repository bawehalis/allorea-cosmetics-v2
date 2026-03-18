// src/lib/email.ts
// GÜVENLİK DÜZELTMESİ:
// - Newsletter unsubscribe linkleri artık HMAC imzalı token içeriyor
// - SMTP bağlantısı lazy başlatılıyor, uygulama startup'ta crash etmiyor
// - HTML şablonlarında XSS koruması için kullanıcı girdisi encode ediliyor
import nodemailer from 'nodemailer'

// Unsubscribe token üreteci — newsletter route'undan import
import { createHmac } from 'crypto'

function generateUnsubToken(email: string): string {
  const secret = process.env.JWT_SECRET ?? 'allorea-dev-secret-CHANGE-IN-PRODUCTION-min32chars'
  return createHmac('sha256', secret)
    .update(email.toLowerCase())
    .digest('hex')
}

// HTML encode — şablon içinde kullanıcı girdisini güvenle göstermek için
function htmlEncode(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// GÜVENLİK: Transporter lazy oluşturuluyor — env değişkenleri yoksa
// sadece email gönderiminde hata alınır, uygulama başlamaz.
function createTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[email] SMTP yapılandırması eksik — email gönderilemez.')
    }
    return null
  }

  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   parseInt(process.env.SMTP_PORT ?? '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

const APP_URL  = process.env.NEXT_PUBLIC_APP_URL ?? 'https://allorea-cosmetics.com'
const FROM     = `"Allorea Cosmetics" <${process.env.SMTP_USER ?? 'noreply@allorea-cosmetics.com'}>`

// ─── Ortak şablon bileşenleri ─────────────────────────────────────────────────
const emailHeader = `
  <div style="max-width:600px;margin:0 auto;font-family:'Georgia',serif;background:#faf9f7;">
    <div style="background:#1c1c1e;padding:28px 40px;text-align:center;">
      <h1 style="color:#faf9f7;font-size:22px;letter-spacing:6px;font-weight:300;margin:0;">
        ALLOREA
      </h1>
    </div>
    <div style="padding:40px;">
`

const emailFooter = (email: string) => {
  const token = generateUnsubToken(email)
  const unsubUrl = `${APP_URL}/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`
  return `
    </div>
    <div style="background:#f0ede8;padding:20px 40px;text-align:center;font-size:11px;color:#8a7e75;">
      <p style="margin:0 0 8px;">
        © ${new Date().getFullYear()} Allorea Cosmetics. All rights reserved.
      </p>
      <p style="margin:0;">
        <a href="${APP_URL}/legal/privacy" style="color:#bf6043;text-decoration:none;">Privacy Policy</a>
        &nbsp;·&nbsp;
        <a href="${unsubUrl}" style="color:#bf6043;text-decoration:none;">Unsubscribe</a>
        &nbsp;·&nbsp;
        <a href="${APP_URL}/contact" style="color:#bf6043;text-decoration:none;">Contact Us</a>
      </p>
    </div>
  </div>
`
}

// ─── Email fonksiyonları ──────────────────────────────────────────────────────

interface OrderItem { name: string; quantity: number; price: number }
interface OrderEmailData {
  orderNumber:  string
  email:        string
  firstName:    string
  items:        OrderItem[]
  subtotal:     number
  shipping:     number
  tax:          number
  discount?:    number
  total:        number
}

export async function sendOrderConfirmation(order: OrderEmailData): Promise<void> {
  const transporter = createTransporter()
  if (!transporter) return

  const itemRows = order.items.map(item => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #ecddd0;color:#1c1c1e;">
        ${htmlEncode(item.name)} × ${item.quantity}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #ecddd0;text-align:right;color:#1c1c1e;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('')

  const html = `
    ${emailHeader}
    <h2 style="font-weight:300;color:#1c1c1e;font-size:26px;margin:0 0 8px;">
      Thank You, ${htmlEncode(order.firstName)}!
    </h2>
    <p style="color:#8a7e75;font-size:14px;margin:0 0 28px;">
      Your order <strong style="color:#1c1c1e;">#${htmlEncode(order.orderNumber)}</strong> 
      has been confirmed and is being prepared.
    </p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      ${itemRows}
      ${order.discount ? `
      <tr>
        <td style="padding:8px 0;color:#8a7e75;">Discount</td>
        <td style="padding:8px 0;text-align:right;color:#bf6043;">
          -$${order.discount.toFixed(2)}
        </td>
      </tr>` : ''}
      <tr>
        <td style="padding:8px 0;color:#8a7e75;">Shipping</td>
        <td style="padding:8px 0;text-align:right;color:#1c1c1e;">
          ${order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#8a7e75;">Tax</td>
        <td style="padding:8px 0;text-align:right;color:#1c1c1e;">$${order.tax.toFixed(2)}</td>
      </tr>
      <tr style="border-top:2px solid #1c1c1e;">
        <td style="padding:12px 0;font-weight:600;font-size:16px;color:#1c1c1e;">Total</td>
        <td style="padding:12px 0;text-align:right;font-weight:600;font-size:16px;color:#1c1c1e;">
          $${order.total.toFixed(2)}
        </td>
      </tr>
    </table>
    <div style="text-align:center;margin-top:32px;">
      <a href="${APP_URL}/track?order=${htmlEncode(order.orderNumber)}"
         style="display:inline-block;background:#1c1c1e;color:#faf9f7;padding:14px 32px;
                text-decoration:none;font-size:11px;letter-spacing:3px;text-transform:uppercase;">
        Track Order
      </a>
    </div>
    ${emailFooter(order.email)}
  `

  await transporter.sendMail({
    from:    FROM,
    to:      order.email,
    subject: `Order Confirmed — #${order.orderNumber}`,
    html,
  })
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const transporter = createTransporter()
  if (!transporter) {
    console.warn('[email] Password reset email could not be sent — SMTP not configured')
    return
  }

  // Token URL-safe encode
  const resetUrl = `${APP_URL}/reset-password?token=${encodeURIComponent(token)}`

  const html = `
    ${emailHeader}
    <h2 style="font-weight:300;color:#1c1c1e;font-size:26px;margin:0 0 8px;">
      Password Reset
    </h2>
    <p style="color:#8a7e75;font-size:14px;line-height:1.7;margin:0 0 24px;">
      We received a request to reset your password. Click the button below.
      This link expires in <strong>1 hour</strong>.
    </p>
    <p style="color:#8a7e75;font-size:13px;margin:0 0 24px;">
      If you didn't request this, you can safely ignore this email.
    </p>
    <div style="text-align:center;margin-top:8px;">
      <a href="${resetUrl}"
         style="display:inline-block;background:#bf6043;color:#faf9f7;padding:14px 32px;
                text-decoration:none;font-size:11px;letter-spacing:3px;text-transform:uppercase;">
        Reset Password
      </a>
    </div>
    ${emailFooter(email)}
  `

  await transporter.sendMail({
    from:    FROM,
    to:      email,
    subject: 'Reset Your Password — Allorea Cosmetics',
    html,
  })
}

export async function sendNewsletterWelcome(email: string, name?: string): Promise<void> {
  const transporter = createTransporter()
  if (!transporter) return

  const greeting = name ? `Welcome, ${htmlEncode(name)}!` : 'Welcome!'

  const html = `
    ${emailHeader}
    <h2 style="font-weight:300;color:#1c1c1e;font-size:26px;margin:0 0 8px;">
      ${greeting}
    </h2>
    <p style="color:#8a7e75;font-size:14px;line-height:1.7;margin:0 0 24px;">
      You've joined the Allorea family. Expect exclusive offers, beauty tips, and
      early access to new launches delivered straight to your inbox.
    </p>
    <div style="text-align:center;margin-top:24px;">
      <a href="${APP_URL}/shop"
         style="display:inline-block;background:#1c1c1e;color:#faf9f7;padding:14px 32px;
                text-decoration:none;font-size:11px;letter-spacing:3px;text-transform:uppercase;">
        Shop Now
      </a>
    </div>
    ${emailFooter(email)}
  `

  await transporter.sendMail({
    from:    FROM,
    to:      email,
    subject: 'Welcome to Allorea Cosmetics ✨',
    html,
  })
}
