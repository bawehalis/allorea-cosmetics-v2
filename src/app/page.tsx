import { Metadata } from 'next'
import HeroBanner from '@/components/home/HeroBanner'
import TrustBar from '@/components/home/TrustBar'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import PromoBanner from '@/components/home/PromoBanner'
import BestSellers from '@/components/home/BestSellers'
import BlogSection from '@/components/home/BlogSection'
import NewsletterSection from '@/components/home/NewsletterSection'

export const metadata: Metadata = {
  title: 'Allorea Cosmetics — Luxury Beauty, Naturally Crafted',
  description: 'Discover luxury skincare, makeup, and fragrance crafted with the finest natural ingredients.',
}

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <TrustBar />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoBanner />
      <BestSellers />
      <BlogSection />
      <NewsletterSection />
    </>
  )
}
