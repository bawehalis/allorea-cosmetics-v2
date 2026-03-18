// src/app/robots.ts
import { MetadataRoute } from 'next'
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://allorea-cosmetics.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/account/', '/checkout/', '/cart'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
