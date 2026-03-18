import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
console.log('🌱 Allorea Cosmetics veritabanı seed ediliyor...')

// ─── Admin Kullanıcı ──────────────────────────────────────────────────────
const adminPass = await bcrypt.hash('Admin@Allorea123', 12)
const admin = await prisma.user.upsert({
where: { email: '[admin@allorea-cosmetics.com](mailto:admin@allorea-cosmetics.com)' },
update: {},
create: {
email: '[admin@allorea-cosmetics.com](mailto:admin@allorea-cosmetics.com)',
name: 'Admin',
passwordHash: adminPass,
role: 'ADMIN',
},
})
console.log(`✅ Admin kullanıcı: ${admin.email}`)

// ─── Demo Müşteri ─────────────────────────────────────────────────────────
const custPass = await bcrypt.hash('Customer123!', 12)
await prisma.user.upsert({
where: { email: '[demo@allorea-cosmetics.com](mailto:demo@allorea-cosmetics.com)' },
update: {},
create: {
email: '[demo@allorea-cosmetics.com](mailto:demo@allorea-cosmetics.com)',
name: 'Demo Kullanıcı',
passwordHash: custPass,
role: 'CUSTOMER',
},
})

// ─── Kategoriler ──────────────────────────────────────────────────────────
const categories = await Promise.all([
prisma.category.upsert({
where: { slug: 'skincare' },
update: {},
create: { name: 'Skincare', slug: 'skincare' },
}),
prisma.category.upsert({
where: { slug: 'makeup' },
update: {},
create: { name: 'Makeup', slug: 'makeup' },
}),
])

const catMap: Record<string, string> = {}
categories.forEach(c => { catMap[c.slug] = c.id })

// ─── Ürünler ──────────────────────────────────────────────────────────────
const productsData = [
{
name: 'Allorea Radiance Serum',
slug: 'allorea-radiance-serum',
sku: 'ALR-SER-001',
description: 'C vitamini serumu',
price: 89,
stock: 50,
categorySlug: 'skincare',
},
]

for (const p of productsData) {
const existing = await prisma.product.findUnique({ where: { slug: p.slug } })
if (!existing) {
const { categorySlug, ...rest } = p
await prisma.product.create({
data: {
...rest,
categoryId: catMap[categorySlug],
},
})
}
}

// ─── Site Config ──────────────────────────────────────────────────────────
const configs = [
{ key: 'site.name', value: 'Allorea Cosmetics' },
]

for (const cfg of configs) {
await prisma.siteConfig.upsert({
where: { key: cfg.key },
update: { value: cfg.value },
create: cfg,
})
}

console.log('🎉 Seed tamamlandı!')
}

main()
.catch(e => {
console.error(e)
process.exit(1)
})
.finally(() => prisma.$disconnect())
