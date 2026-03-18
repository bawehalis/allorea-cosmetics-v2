// src/lib/mock-data.ts — Allorea Cosmetics v2
// Kapsamlı örnek veri: 3 ürün, 12 yorum, tam bundle sistemi

export interface ProductBundle {
  id: string
  label: string
  quantity: number
  price: number
  comparePrice?: number
  discountPercent: number
  isMostPopular: boolean
  savings?: number
}

export interface ProductImage {
  id: string
  url: string
  alt?: string
  position: number
}

export interface ProductFaq {
  question: string
  answer: string
}

export interface Review {
  id: string
  name: string
  rating: number
  title: string
  body: string
  date: string
  isVerified: boolean
  isFeatured?: boolean
  avatar?: string
  beforeImage?: string
  afterImage?: string
}

export interface SalesProduct {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  problemText: string
  solutionText: string
  howToUse: string[]
  ingredients: string
  price: number
  comparePrice: number
  images: ProductImage[]
  bundles: ProductBundle[]
  reviews: Review[]
  faqs: ProductFaq[]
  stock: number
  isBestSeller: boolean
  isNew: boolean
  badge?: string
  categorySlug: string
}

// ─────────────────────────────────────────────────────────
// ÜRÜN 1: Saç Serumu (ana ürün)
// ─────────────────────────────────────────────────────────
const SAC_SERUMU_REVIEWS: Review[] = [
  // ─── 5 yıldız — uzun, detaylı, before/after görsellerle ──────────────
  {
    id:'r1', name:'Elif K.', rating:5,
    title:'3 haftada fark çok belirgin — önce/sonra fotoğrafım var',
    body:'Dürüst olmak gerekirse çok inanmıyordum. Instagram\'da gördüm, inceleme yaptım ve 3\'lü paketi sipariş ettim. İlk 10 gün hiçbir şey hissetmedim, hayal kırıklığı yaşadım. Ama 3. haftanın sonunda duş sonrası taramada saç dökülmesinin belirgin biçimde azaldığını fark ettim. Fotoğraf çektim, karşılaştırdım — gerçekten. 6. haftada arkadaşlarım "saçın dolgunlaştı mı" diye sormaya başladı. 3 ay tamamladım ve şu an saçım eskisine kıyasla çok daha dolgun görünüyor. Herkese öneririm ama sabır şart.',
    date:'12 Ocak 2025', isVerified:true, isFeatured:true,
    beforeImage:'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=400&q=80',
    afterImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80',
  },
  {
    id:'r2', name:'Selin A.', rating:5,
    title:'Doğum sonrası dökülme için gerçekten işe yarıyor',
    body:'Doğum sonrası 4. ayda saç dökülmem zirveye ulaştı. Duş sapı tıkanıyordu her gün. Dermatoloğa gittim, vitamin önerdi ama yetmedi. Bu ürünü tavsiye üzerine denedim. 7 hafta sonra yeni tüyler çıktığını fark ettim — özellikle alnın üzerinde ve şakaklarda. Artık 3 aylık kullanıcıyım ve saçım %70 eskisinden daha iyi durumda. Koku çok hafif, uygulama kolay. Durulama gerekmemesi de büyük artı çünkü bebek varken zaman yok.',
    date:'8 Ocak 2025', isVerified:true, isFeatured:true,
  },
  {
    id:'r3', name:'Canan Y.', rating:5,
    title:'Dermal roller ile beraber kullanın — etkisi katlanıyor',
    body:'Dermatolog tavsiyesiyle başladım: serumu uyguladıktan sonra 5 dakika dermal roller ile masaj. Bu kombinasyonu 2. haftadan itibaren uyguladım. 5. haftada belirgin tüy çıkışı gördüm. Sadece serumu kullananlardan çok daha hızlı sonuç aldım. Denemenizi öneririm.',
    date:'3 Ocak 2025', isVerified:true, isFeatured:true,
    beforeImage:'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=400&q=80',
    afterImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id:'r4', name:'Büşra K.', rating:5,
    title:'55 yaşındaki annem de kullanıyor — mucize gibi',
    body:'Önce kendim için aldım, sonra anneme de gönderdim. Bende 4. haftada, annede 5. haftada etkisi görülmeye başladı. İçerik listesini inceledim, biyotin konsantrasyonu rakiplerden yüksek. Kafein de saç derisi kan dolaşımını artırıyor. Fiyat-performans olarak çok uygun, özellikle 3\'lü pakette.',
    date:'10 Aralık 2024', isVerified:true, isFeatured:true,
  },
  // ─── 4 yıldız — gerçekçi, olumlu ama eleştirili ──────────────────────
  {
    id:'r5', name:'Zeynep B.', rating:4,
    title:'Etkili ama ilk ay sabır şart — acele etmeyin',
    body:'İlk ay sonuç göremedim, neredeyse bırakacaktım. "2 haftada sonuç aldım" yorumları okuyunca hayal kırıklığı yaşadım. Ama 6. haftada fark ettim: dökülme azalmış. 3 ay bitti, saçım daha dolgun. Bir eksi: şişenin ağzı bazen tıkanıyor. Ama ürünün etkisi gerçek. Sabırsız insanlara tavsiyem: en az 6 hafta bekleyin, bırakmayın.',
    date:'28 Aralık 2024', isVerified:true,
  },
  {
    id:'r6', name:'Gül Ö.', rating:4,
    title:'Şişe küçük, 3\'lü paket alın — etkisi var',
    body:'1 şişeyle başladım, 28 günde bitti. Dökülme hissedilir biçimde azaldı ama 1 şişeyle yetmez, en az 3 ay kullanmak gerekiyor. 3\'lü paket çok daha ekonomik ve mantıklı. 4 yıldız veriyorum çünkü tek şişe pahalıya geliyor ama pakette fiyat çok düşüyor.',
    date:'5 Aralık 2024', isVerified:true,
  },
  {
    id:'r7', name:'Derya K.', rating:4,
    title:'Stres kaynaklı dökülmede işe yaradı',
    body:'Yoğun iş temposu yüzünden saç dökülmem başlamıştı. 6 haftalık kullanımdan sonra dökülme yaklaşık %60 azaldı. 4 yıldız çünkü henüz 2. aya giriyorum, kalıcılığını test ettikten sonra tekrar yorum yapacağım.',
    date:'6 Ocak 2025', isVerified:true,
  },
  // ─── 3 yıldız — gerçekçi, karışık ──────────────────────────────────
  {
    id:'r8', name:'Tuğba S.', rating:3,
    title:'Koku rahatsız edici bulunabilir — benim için olmadı',
    body:'2 ay kullandım. Saç dökülmemde çok büyük değişiklik hissetmedim. Asıl sorunum koku — çay ağacı yağı bileşeni benim için çok baskın geldi. Saç kuruduğunda koku geçiyor ama uygulama sırasında rahatsız edici buldum. İade ettim, müşteri hizmetleri çok ilgiliydi ve sorunsuz çözüldü. Ürün bana uymadı ama şirket güvenilir.',
    date:'18 Aralık 2024', isVerified:true,
  },
  // ─── 5 yıldız — kısa ────────────────────────────────────────────────
  {
    id:'r9', name:'Fatma D.', rating:5,
    title:'45 günde gözle görülür fark',
    body:'45 gün kullandım, ayna karşısında saç çizgimin dolulaştığını fark ettim. Fiyat-performans piyasada en iyi. 3\'lü paketi aldım, yeterliydi.',
    date:'15 Aralık 2024', isVerified:true,
  },
  {
    id:'r10', name:'Ayşe M.', rating:5,
    title:'Hafif koku, hızlı emilim — sabah rutinine eklenmesi kolay',
    body:'Hem anneme hem kendime aldım. Koku hafif ve hoş. Suyla temas etmeden 20 dakikada tamamen emiyor. Sabah rutinime çok kolay eklendi.',
    date:'20 Aralık 2024', isVerified:false,
  },
  {
    id:'r11', name:'Merve T.', rating:5,
    title:'Pişman olmayacaksınız',
    body:'Annem de kullanmaya başladı. İkimiz de memnunuz. Duştan sonra tarakta kalan saç miktarı dramatik biçimde azaldı.',
    date:'2 Ocak 2025', isVerified:true,
  },
  {
    id:'r12', name:'Hande Ö.', rating:5,
    title:'Erkek kardeşim de kullanıyor — ikimiz de çok memnunuz',
    body:'Önce kendim için aldım. Erkek kardeşim saç çizgisini kaybetmeye başlamıştı ve denemek istedi. 10 haftadır ikimiz de kullanıyoruz. Bende dökülme azaldı; onda ise saç çizgisinde belirgin dolgunlaşma var.',
    date:'9 Ocak 2025', isVerified:true,
  },
]

export const SAC_SERUMU: SalesProduct = {
  id: 'sac-serumu-001',
  name: 'Allorea Saç Yoğunlaştırıcı Serum',
  slug: 'allorea-sac-yogunlastirici-serum',
  tagline: '30 Günde Görünür Fark — Ya Paranızı Geri Alın',
  description: 'Klinik olarak test edilmiş biotin, kafein ve keratin kompleksiyle formüle edilmiş güçlendirici serum. Saç derisini besler, saç dökülmesini yavaşlatır, yeni saç çıkışını destekler.',
  problemText: `**Saç dökülmesi yaşıyorsanız yalnız değilsiniz.**

Her sabah yastıkta, her gün duşta, her taramada düşen saçları görmek... Bu sadece estetik bir sorun değil, özgüveninizi de etkiliyor.

Kadınların %40'ı 35 yaşından sonra saç incelenmesi ve dökülmesi yaşıyor. Erkeklerin ise büyük çoğunluğu 50'li yaşlara kadar belirgin seyrelmeler fark ediyor.

Peki ne yapıyorsunuz? Pahalı şampuanlar, vitamin takviyeleri, belki doktora gidiyorsunuz... Ama hiçbiri kalıcı çözüm sunmuyor.`,
  solutionText: `**Allorea Serum farklı çalışıyor — saçın kökünden.**

Çünkü sorun sadece saç telinde değil, saç derisinde. Serum, özel mikro-kapsül teknolojisiyle aktif bileşenleri doğrudan saç köküne ulaştırır.

**Klinik sonuçlar:**
- 4. haftada saç dökülmesinde %47 azalma
- 8. haftada yeni tüy oluşumunda %63 artış
- 3. ayda saç yoğunluğunda %31 görünür iyileşme

**Her sabah 5 dakika** — Bu kadar. Serum saç derisine masaj yapılarak uygulanır, durulama gerekmez.`,
  howToUse: [
    'Saçlarınızı yıkayın ve havluyla kurutun',
    'Aplikatörle serumu doğrudan saç derisine 4-5 noktaya damlatın',
    'Parmak uçlarıyla 2-3 dakika nazikçe masaj yapın',
    'Durulamayın — gün içinde veya gecelik bırakın',
    'Haftada 5-7 gün düzenli kullanın',
  ],
  ingredients: 'Biotin %5, Kafein %1.5, Keratin Hidrolizat, Panthenol (B5), Niasinamid, Arginin, Çay Ağacı Yağı, Aloe Vera Özü',
  price: 349,
  comparePrice: 499,
  images: [
    { id:'i1', url:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', alt:'Allorea Saç Serumu', position:0 },
    { id:'i2', url:'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80', alt:'Serum dokusu', position:1 },
    { id:'i3', url:'https://images.unsplash.com/photo-1601049541271-d2dd2a8ef05b?auto=format&fit=crop&w=800&q=80', alt:'Uygulama', position:2 },
    { id:'i4', url:'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?auto=format&fit=crop&w=800&q=80', alt:'Ürün detayı', position:3 },
  ],
  bundles: [
    { id:'b1', label:'1 Adet',  quantity:1, price:349, comparePrice:499,  discountPercent:0,  isMostPopular:false, savings:0    },
    { id:'b2', label:'3 Adet',  quantity:3, price:799, comparePrice:1497, discountPercent:47, isMostPopular:true,  savings:698  },
    { id:'b3', label:'5 Adet',  quantity:5, price:1199,comparePrice:2495, discountPercent:52, isMostPopular:false, savings:1296 },
  ],
  reviews: SAC_SERUMU_REVIEWS,
  faqs: [
    { question:'Sonuçları ne zaman görürüm?', answer:'İlk 2-4 haftada saç dökülmesinde azalma fark edersiniz. Yeni tüy çıkışı ve yoğunluk artışı genellikle 6-12. haftada belirginleşir.' },
    { question:'Kadınlar da kullanabilir mi?', answer:'Evet! Formülümüz hem kadın hem erkek saç dökülmesine karşı etkili olarak geliştirilmiştir.' },
    { question:'Boyalı saçlarda kullanılabilir mi?', answer:'Evet, serum boyalı, röfle ve kimyasal işlem görmüş saçlarda güvenle kullanılabilir. Rengi etkilemez.' },
    { question:'Durulamam gerekiyor mu?', answer:'Hayır. Serum "leave-in" yani durulama gerektirmeyen bir formüle sahiptir.' },
    { question:'Para iade garantisi var mı?', answer:'30 gün boyunca kullanın. Sonuç görmezseniz, ürünü iade ederek tam para iadenizi alın.' },
    { question:'Kaç aylık kullanım önerilir?', answer:'En iyi sonuç için en az 3 aylık düzenli kullanım önerilir. Bu nedenle 3\'lü ve 5\'li paketler en popüler seçeneklerimizdir.' },
  ],
  stock: 47,
  isBestSeller: true,
  isNew: false,
  badge: '⚡ Sınırlı Stok',
  categorySlug: 'hair-care',
}

// ─────────────────────────────────────────────────────────
// ÜRÜN 2: Gece Onarım Kremi
// ─────────────────────────────────────────────────────────
export const GECE_KREMI: SalesProduct = {
  id: 'gece-kremi-001',
  name: 'Allorea Gece Onarım Kremi',
  slug: 'allorea-gece-onarim-kremi',
  tagline: 'Uyurken Cildiniz Yenilensin',
  description: 'Retinol ve peptit kompleksiyle hazırlanan bu gece kremi, uyurken cildinizi yeniler. Sabah uyanışında görünür tazelik ve pürüzsüzlük.',
  problemText: `**Yaşlanma izleri mi fark ettiniz?**

Sabah aynaya baktığınızda ince çizgiler, soluk cilt tonu ve kırışıklıklar... Bu sorunlar zamanla derinleşiyor.

Peki doğru gece bakımı yapıyor musunuz?`,
  solutionText: `**Allorea Gece Kremi klinik formülle çalışıyor.**

Retinol hücre yenilenmesini hızlandırır, peptitler cilt elastikiyetini artırır.

**Sonuçlar:**
- 2. haftada cilt pürüzsüzlüğünde artış
- 4. haftada kırışıklıklarda belirgin azalma`,
  howToUse: [
    'Akşam yüzünüzü temizleyin',
    'Parmak uçlarıyla yüz ve boyun bölgesine uygulayın',
    'Masaj yaparak tamamen emdirin',
    'Sabah SPF ile koruyun',
  ],
  ingredients: 'Retinol %0.3, Bakuchiol, Peptit Kompleksi, Shea Yağı, Squalane, Niasinamid',
  price: 449,
  comparePrice: 599,
  images: [
    { id:'i1', url:'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?auto=format&fit=crop&w=800&q=80', alt:'Gece Onarım Kremi', position:0 },
    { id:'i2', url:'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80', alt:'Krem dokusu', position:1 },
  ],
  bundles: [
    { id:'b1', label:'1 Adet', quantity:1, price:449,  comparePrice:599,  discountPercent:0,  isMostPopular:false, savings:0   },
    { id:'b2', label:'2 Adet', quantity:2, price:749,  comparePrice:1198, discountPercent:37, isMostPopular:true,  savings:449 },
    { id:'b3', label:'3 Adet', quantity:3, price:999,  comparePrice:1797, discountPercent:44, isMostPopular:false, savings:798 },
  ],
  reviews: [
    { id:'cr1', name:'Hande K.', rating:5, title:'Cilt kremi olmaz olmaz', body:'2 hafta kullanım sonrası arkadaşlarım fark etti. Cildinizin ışıldadığını söylediler.', date:'5 Ocak 2025', isVerified:true },
    { id:'cr2', name:'Nilüfer T.', rating:4, title:'İyi ürün', body:'Kıvamı biraz ağır ama etkisi kesinlikle var. Yaz için hafif versiyonu çıkarılabilir.', date:'28 Aralık 2024', isVerified:true },
  ],
  faqs: [
    { question:'Hassas cilt kullanabilir mi?', answer:'Evet, hipoalerjenik formülle üretilmiştir. Yine de patch test önerilir.' },
    { question:'Retinol yeni başlayanlar için uygun mu?', answer:'%0.3 gibi düşük bir konsantrasyon kullandık. Haftada 2-3 gece başlayıp yavaş yavaş artırabilirsiniz.' },
  ],
  stock: 32,
  isBestSeller: true,
  isNew: false,
  badge: '🌙 Çok Satan',
  categorySlug: 'skincare',
}

// ─────────────────────────────────────────────────────────
// ÜRÜN 3: C Vitamini Serum (yeni)
// ─────────────────────────────────────────────────────────
export const C_VITAMIN_SERUM: SalesProduct = {
  id: 'c-vitamin-serum-001',
  name: 'Allorea Radiance C Vitamini Serum',
  slug: 'allorea-radiance-c-vitamini-serum',
  tagline: '7 Günde Aydınlık Cilt — Garantili',
  description: 'C vitamini kompleksi ile formüle edilmiş bu güçlü aydınlatıcı serum, cilt dokusunu düzelterek doğal parlaklık verir.',
  problemText: `**Soluk ve donuk cilt mi?**

Stres, uyku eksikliği ve çevre kirliliği cildinizi yoruyor. Lekelerin ve düzensiz cilt tonunun nedeni derine gömülmüş bu hasarlar.`,
  solutionText: `**C Vitamini cildin en güçlü antioksidanıdır.**

Serbest radikallere karşı savaşır, kolajen üretimini destekler, leke görünümünü azaltır.

**Sonuçlar:**
- 7 günde parlaklık artışı
- 4 haftada leke azalması`,
  howToUse: [
    'Sabah temiz cilde uygulayın',
    '3-4 damla alın, yüze yayın',
    'Emildikten sonra nemlendirici kullanın',
    'SPF ile günü tamamlayın',
  ],
  ingredients: 'Askorbik Asit %15, Niasinamid %5, Hyalüronik Asit, Ferulik Asit, Tokoferol',
  price: 289,
  comparePrice: 399,
  images: [
    { id:'i1', url:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', alt:'C Vitamini Serum', position:0 },
    { id:'i2', url:'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80', alt:'Serum dokusu', position:1 },
  ],
  bundles: [
    { id:'b1', label:'1 Adet', quantity:1, price:289, comparePrice:399,  discountPercent:0,  isMostPopular:false, savings:0   },
    { id:'b2', label:'3 Adet', quantity:3, price:699, comparePrice:1197, discountPercent:42, isMostPopular:true,  savings:498 },
    { id:'b3', label:'5 Adet', quantity:5, price:999, comparePrice:1995, discountPercent:50, isMostPopular:false, savings:996 },
  ],
  reviews: [
    { id:'vr1', name:'Aylin S.', rating:5, title:'Gerçekten parlıyor', body:'1 hafta sonra arkadaşlarım "cildine ne yaptın" diye sormaya başladı. İnanılmaz!', date:'10 Ocak 2025', isVerified:true, isFeatured:true },
    { id:'vr2', name:'Gizem P.', rating:5, title:'Lekelerim gidiyor', body:'3 aylık güneş lekesi 4 haftada belirgin biçimde soldu. Çok memnunum.', date:'2 Ocak 2025', isVerified:true },
  ],
  faqs: [
    { question:'Sabah mı akşam mı kullanılmalı?', answer:'C vitamini sabah kullanımına idealdir. Antioksidan özelliği sayesinde gün boyu UV hasarına karşı korur.' },
    { question:'Retinol ile birlikte kullanılabilir mi?', answer:'Retinol gece, C vitamini sabah kullanılması önerilir. Birlikte aynı anda uygulamayın.' },
  ],
  stock: 89,
  isBestSeller: false,
  isNew: true,
  badge: '✨ Yeni Ürün',
  categorySlug: 'serums',
}

// ─────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────
export const ALL_PRODUCTS: SalesProduct[] = [SAC_SERUMU, GECE_KREMI, C_VITAMIN_SERUM]

export function getProductBySlug(slug: string): SalesProduct | undefined {
  return ALL_PRODUCTS.find(p => p.slug === slug)
}

export interface ProductCard {
  id: string; name: string; slug: string; tagline: string
  price: number; comparePrice: number; image: string
  badge?: string; rating: number; reviewCount: number
  bestBundle?: ProductBundle
}

export const FEATURED_PRODUCTS: ProductCard[] = ALL_PRODUCTS.map(p => ({
  id:           p.id,
  name:         p.name,
  slug:         p.slug,
  tagline:      p.tagline,
  price:        p.price,
  comparePrice: p.comparePrice,
  image:        p.images[0]?.url || '',
  badge:        p.badge,
  rating:       p.reviews.reduce((s,r)=>s+r.rating,0) / p.reviews.length,
  reviewCount:  p.reviews.length,
  bestBundle:   p.bundles.find(b => b.isMostPopular),
}))

// Tüm yorumlar (admin panel için)
export const ALL_REVIEWS = ALL_PRODUCTS.flatMap(p =>
  p.reviews.map(r => ({ ...r, productName: p.name, productSlug: p.slug }))
)

// ─── Eski adlarla backward-compat export'lar ─────────────────────────────────
// Home component'leri hâlâ bu isimleri kullanıyor

import type { Category } from '@/types'

export const CATEGORIES: Category[] = [
  { id:'1', name:'Cilt Bakımı',   slug:'skincare',  description:'Cildinizi besleyin' },
  { id:'2', name:'Makyaj',        slug:'makeup',    description:'Güzelliğinizi ifade edin' },
  { id:'3', name:'Vücut Bakımı',  slug:'body-care', description:'Baştanbaşa lüks' },
  { id:'4', name:'Parfüm',        slug:'fragrance', description:'Hikayenizi anlatan kokular' },
  { id:'5', name:'Saç Bakımı',    slug:'hair-care', description:'Evde salon kalitesi' },
  { id:'6', name:'Serumlar',      slug:'serums',    description:'Yoğunlaştırılmış etki' },
]

// PRODUCTS: ana sayfa featured/bestseller komponentleri için
export const PRODUCTS = ALL_PRODUCTS.map(p => ({
  id:           p.id,
  name:         p.name,
  slug:         p.slug,
  description:  p.description,
  price:        p.price,
  comparePrice: p.comparePrice,
  sku:          p.id,
  stock:        p.stock,
  isActive:     true,
  isFeatured:   p.isBestSeller,
  isBestSeller: p.isBestSeller,
  isNew:        p.isNew,
  category:     { id:p.categorySlug, name:p.categorySlug, slug:p.categorySlug },
  images:       p.images,
  variants:     [],
  averageRating: p.reviews.reduce((s,r)=>s+r.rating,0) / p.reviews.length,
  reviewCount:   p.reviews.length,
  tags:          [],
  createdAt:    '2024-01-01',
  updatedAt:    '2024-01-01',
}))

export const BLOG_POSTS = [
  {
    id:'1', title:'C Vitamini: Cilt Bakımının Altın Standardı',
    slug:'c-vitamini-cilt-bakiminin-altin-standardi',
    excerpt:'C vitamini neden en güçlü antioksidanlardan biridir?',
    content:'C vitamini, dermatolojinin uzun zamandır değer verdiği bir bileşendir...',
    image:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    authorName:'Dr. Isabelle Laurent',
    tags:['cilt-bakımı','c-vitamini'],
    publishedAt:'2025-01-15', createdAt:'2025-01-15',
  },
  {
    id:'2', title:'Yeni Başlayanlar İçin Cilt Bakım Rutini',
    slug:'yeni-baslayanlar-icin-cilt-bakim-rutini',
    excerpt:'Cilt bakımına nereden başlayacağınızı bilmiyor musunuz?',
    content:'Etkili bir cilt bakım rutini oluşturmak göz korkutucu görünebilir...',
    image:'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    authorName:'Sophia Chen',
    tags:['cilt-bakımı','rutin'],
    publishedAt:'2025-01-08', createdAt:'2025-01-08',
  },
]
