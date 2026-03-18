// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Allorea Cosmetics veritabanı seed ediliyor...')

  // ─── Admin Kullanıcı ──────────────────────────────────────────────────────
  const adminPass = await bcrypt.hash('Admin@Allorea123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@allorea-cosmetics.com' },
    update: {},
    create: {
      email: 'admin@allorea-cosmetics.com',
      name: 'Admin',
      passwordHash: adminPass,
      role: 'ADMIN',
    },
  })
  console.log(`✅ Admin kullanıcı: ${admin.email}`)
  console.log('   Şifre: (seed sırasında belirlendi — üretimde hemen değiştirin!)')

  // ─── Demo Müşteri ─────────────────────────────────────────────────────────
  const custPass = await bcrypt.hash('Customer123!', 12)
  await prisma.user.upsert({
    where: { email: 'demo@allorea-cosmetics.com' },
    update: {},
    create: {
      email: 'demo@allorea-cosmetics.com',
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
      create: { name: 'Skincare', slug: 'skincare', description: 'Cilt bakım ürünleri',
        image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80' },
    }),
    prisma.category.upsert({
      where: { slug: 'makeup' },
      update: {},
      create: { name: 'Makeup', slug: 'makeup', description: 'Makyaj ürünleri',
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80' },
    }),
    prisma.category.upsert({
      where: { slug: 'body-care' },
      update: {},
      create: { name: 'Body Care', slug: 'body-care', description: 'Vücut bakım ürünleri',
        image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38afc?auto=format&fit=crop&w=600&q=80' },
    }),
    prisma.category.upsert({
      where: { slug: 'fragrance' },
      update: {},
      create: { name: 'Fragrance', slug: 'fragrance', description: 'Parfümler',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?auto=format&fit=crop&w=600&q=80' },
    }),
    prisma.category.upsert({
      where: { slug: 'hair-care' },
      update: {},
      create: { name: 'Hair Care', slug: 'hair-care', description: 'Saç bakım ürünleri',
        image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=600&q=80' },
    }),
    prisma.category.upsert({
      where: { slug: 'serums' },
      update: {},
      create: { name: 'Serums', slug: 'serums', description: 'Serumlar',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80' },
    }),
  ])
  console.log(`✅ ${categories.length} kategori oluşturuldu`)

  const catMap: Record<string, string> = {}
  categories.forEach(c => { catMap[c.slug] = c.id })

  // ─── Ürünler ──────────────────────────────────────────────────────────────
  const productsData = [
    {
      name: 'Allorea Radiance Serum', slug: 'allorea-radiance-serum', sku: 'ALR-SER-001',
      description: 'C vitamini kompleksi ile formüle edilmiş bu güçlü aydınlatıcı serum, cilt dokusunu düzelterek doğal parlaklık verir.',
      ingredients: 'Askorbik Asit %15, Niasinamid %5, Hyalüronik Asit, Ferulik Asit, Tokoferol',
      price: 89, comparePrice: 110, stock: 45, lowStockAt: 10,
      isActive: true, isFeatured: true, isBestSeller: true, isNew: false,
      categorySlug: 'serums',
      images: [
        { url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', alt: 'Allorea Radiance Serum', position: 0 },
        { url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80', alt: 'Serum dokusu', position: 1 },
        { url: 'https://images.unsplash.com/photo-1601049541271-d2dd2a8ef05b?auto=format&fit=crop&w=800&q=80', alt: 'Ürün detayı', position: 2 },
      ],
      tags: ['çok-satan', 'c-vitamini', 'aydınlatıcı'],
    },
    {
      name: 'Kadife Gül Dudak Bakımı', slug: 'kadife-gul-dudak-bakimi', sku: 'ALR-LIP-002',
      description: 'Gül yağı ve shea yağıyla zenginleştirilmiş dudak tedavisi. Anında nem, uzun süreli koruma.',
      price: 32, stock: 78, lowStockAt: 15,
      isActive: true, isFeatured: true, isBestSeller: false, isNew: true,
      categorySlug: 'makeup',
      images: [
        { url: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2b18?auto=format&fit=crop&w=800&q=80', alt: 'Kadife Gül Dudak Bakımı', position: 0 },
        { url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80', alt: 'Uygulama', position: 1 },
      ],
      tags: ['dudak', 'nemlendirici', 'gül'],
    },
    {
      name: 'Gece Onarım Kremi', slug: 'gece-onarim-kremi', sku: 'ALR-CRM-003',
      description: 'Retinol ve peptit kompleksiyle hazırlanan gece kremi. Uyurken cildinizi yeniler.',
      ingredients: 'Retinol %0.3, Bakuchiol, Peptit Kompleksi, Shea Yağı, Squalane',
      price: 115, comparePrice: 140, stock: 32, lowStockAt: 8,
      isActive: true, isFeatured: true, isBestSeller: true, isNew: false,
      categorySlug: 'skincare',
      images: [
        { url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?auto=format&fit=crop&w=800&q=80', alt: 'Gece Onarım Kremi', position: 0 },
        { url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80', alt: 'Krem dokusu', position: 1 },
      ],
      tags: ['çok-satan', 'anti-aging', 'retinol'],
    },
    {
      name: 'Saten Cilt Vücut Yağı', slug: 'saten-cilt-vucut-yagi', sku: 'ALR-BOD-004',
      description: 'Argan ve jojoba yağları karışımından oluşan lüks vücut yağı. Işıltılı parlaklık.',
      price: 68, stock: 56, lowStockAt: 12,
      isActive: true, isFeatured: false, isBestSeller: true, isNew: false,
      categorySlug: 'body-care',
      images: [
        { url: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38afc?auto=format&fit=crop&w=800&q=80', alt: 'Saten Cilt Vücut Yağı', position: 0 },
      ],
      tags: ['vücut', 'yağ', 'parlaklık'],
    },
    {
      name: 'Bulut Yumuşaklığında Pudra', slug: 'bulut-yumusakliginda-pudra', sku: 'ALR-MKP-005',
      description: 'Nefes alan mikro-silika formülü. Günü mat ve pürüzsüz bitirmenin sırrı.',
      price: 48, stock: 89, lowStockAt: 20,
      isActive: true, isFeatured: false, isBestSeller: false, isNew: true,
      categorySlug: 'makeup',
      images: [
        { url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80', alt: 'Bulut Yumuşaklığında Pudra', position: 0 },
      ],
      tags: ['pudra', 'ayar', 'makyaj'],
    },
    {
      name: 'Fleur Blanche Eau de Parfum', slug: 'fleur-blanche-eau-de-parfum', sku: 'ALR-FRG-006',
      description: 'Bergamot, jasmin ve sandal ağacı notalarıyla benzersiz bir koku deneyimi.',
      price: 195, comparePrice: 220, stock: 23, lowStockAt: 5,
      isActive: true, isFeatured: true, isBestSeller: false, isNew: false,
      categorySlug: 'fragrance',
      images: [
        { url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?auto=format&fit=crop&w=800&q=80', alt: 'Fleur Blanche Eau de Parfum', position: 0 },
      ],
      tags: ['parfüm', 'çiçeksi', 'lüks'],
    },
    {
      name: 'Hydra Boost Nemlendirici', slug: 'hydra-boost-nemlendirici', sku: 'ALR-SKN-007',
      description: '5 katlı hyalüronik asit ile 72 saate kadar uzun süreli hidrasyon.',
      price: 75, stock: 112, lowStockAt: 20,
      isActive: true, isFeatured: false, isBestSeller: true, isNew: false,
      categorySlug: 'skincare',
      images: [
        { url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80', alt: 'Hydra Boost Nemlendirici', position: 0 },
      ],
      tags: ['nemlendirici', 'hyalüronik-asit', 'nem'],
    },
    {
      name: 'İpek Onarım Saç Maskesi', slug: 'ipek-onarim-sac-maskesi', sku: 'ALR-HAR-008',
      description: 'Keratin ve argan yağı ile hasarlı saçları onarır, özlü parlaklık kazandırır.',
      price: 55, comparePrice: 68, stock: 67, lowStockAt: 15,
      isActive: true, isFeatured: false, isBestSeller: false, isNew: true,
      categorySlug: 'hair-care',
      images: [
        { url: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=800&q=80', alt: 'İpek Onarım Saç Maskesi', position: 0 },
      ],
      tags: ['saç', 'onarım', 'keratin'],
    },
  ]

  for (const p of productsData) {
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } })
    if (!existing) {
      const { images, tags, categorySlug, ...rest } = p
      await prisma.product.create({
        data: {
          ...rest,
          categoryId: catMap[categorySlug],
          images: { create: images },
          tags: { create: tags.map(t => ({ tag: t })) },
        },
      })
    }
  }
  console.log(`✅ ${productsData.length} ürün oluşturuldu`)

  // ─── Kuponlar ─────────────────────────────────────────────────────────────
  const coupons = [
    { code: 'ALLOREA15', type: 'PERCENTAGE' as const, value: 15, isActive: true },
    { code: 'ALLOREA30', type: 'PERCENTAGE' as const, value: 30, minPurchase: 100, isActive: true },
    { code: 'GLOW20',    type: 'PERCENTAGE' as const, value: 20, minPurchase: 75,  isActive: true },
    { code: 'WELCOME10', type: 'FIXED'      as const, value: 10, minPurchase: 50,  isActive: true },
  ]
  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    })
  }
  console.log(`✅ ${coupons.length} kupon oluşturuldu`)

  // ─── Blog Yazıları ────────────────────────────────────────────────────────
  const blogs = [
    {
      slug: 'c-vitamini-cilt-bakiminin-altin-standardi',
      title: 'C Vitamini: Cilt Bakımının Altın Standardı',
      excerpt: 'C vitamini neden en güçlü antioksidanlardan biridir ve sabah rutininize nasıl dahil etmelisiniz?',
      content: 'C vitamini, dermatolojinin uzun zamandır değer verdiği bir bileşendir. Antioksidan özellikleriyle serbest radikallere karşı mücadele eder ve kolajen üretimini destekler...',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      authorName: 'Dr. Isabelle Laurent',
      tags: ['cilt-bakımı', 'c-vitamini', 'antioksidan'],
      isPublished: true,
      publishedAt: new Date('2024-05-15'),
    },
    {
      slug: 'yeni-baslayanlar-icin-cilt-bakim-rutini',
      title: 'Yeni Başlayanlar İçin Cilt Bakım Rutini',
      excerpt: 'Cilt bakımına nereden başlayacağınızı bilmiyor musunuz? İşte adım adım rehberiniz.',
      content: 'Etkili bir cilt bakım rutini oluşturmak göz korkutucu görünebilir. Ancak doğru ürünlerle ve doğru sırayla uygulandığında inanılmaz sonuçlar elde edebilirsiniz...',
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
      authorName: 'Sophia Chen',
      tags: ['cilt-bakımı', 'rutin', 'başlangıç'],
      isPublished: true,
      publishedAt: new Date('2024-05-08'),
    },
  ]
  for (const b of blogs) {
    await prisma.blogPost.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    })
  }
  console.log(`✅ ${blogs.length} blog yazısı oluşturuldu`)

  console.log('\n🎉 Seed tamamlandı!')
  console.log('─────────────────────────────────────────────')
  console.log('  Admin: admin@allorea-cosmetics.com')
  console.log('  Şifre: (seed sırasında belirlendi)')
  console.log('  URL:   http://localhost:3000/admin')
  console.log('─────────────────────────────────────────────')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
