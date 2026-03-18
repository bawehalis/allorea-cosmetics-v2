// src/app/sitemap.ts
import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://allorea-cosmetics.com'

// In production this would query the DB. Using static data here.
const PRODUCT_SLUGS = [
  'allorea-radiance-serum', 'kadife-gul-dudak-bakimi', 'gece-onarim-kremi',
  'satin-skin-body-oil', 'cloud-soft-setting-powder', 'fleur-blanche-eau-de-parfum',
  'hydra-boost-moisturiser', 'silk-repair-hair-mask',
]

const CATEGORY_SLUGS = ['skincare', 'makeup', 'body-care', 'fragrance', 'hair-care', 'serums']

const BLOG_SLUGS = ['science-behind-vitamin-c', 'complete-skincare-routine-guide', 'art-of-layering-fragrance']

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/legal/privacy`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${BASE_URL}/legal/terms`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${BASE_URL}/legal/shipping`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${BASE_URL}/legal/returns`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
  ]

  const productPages = PRODUCT_SLUGS.map(slug => ({
    url: `${BASE_URL}/product/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categoryPages = CATEGORY_SLUGS.map(slug => ({
    url: `${BASE_URL}/shop?category=${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  const blogPages = BLOG_SLUGS.map(slug => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...productPages, ...categoryPages, ...blogPages]
}
