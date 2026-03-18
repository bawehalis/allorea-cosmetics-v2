import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'

export default function BlogSection() {
  return (
    <section className="page-section bg-white">
      <div className="container-main">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <p className="section-subtitle">Güzellik Rehberi</p>
            <h2 className="section-title">Dergiden</h2>
          </div>
          <Link href="/blog" className="flex items-center gap-2 font-body text-sm text-nude-600 hover:text-brand-600 transition-colors group">
            Tüm Makaleler <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post, i) => (
            <article key={post.id} className="group">
              <Link href={`/blog/${post.slug}`} className="block overflow-hidden mb-5">
                <div className="relative aspect-[4/3] overflow-hidden bg-nude-100">
                  <Image
                    src={post.image || ''}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </Link>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="font-body text-[10px] tracking-[0.15em] uppercase text-brand-600">{tag}</span>
                  ))}
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="font-display text-xl font-light text-charcoal group-hover:text-brand-600 transition-colors leading-snug mb-3">
                    {post.title}
                  </h3>
                </Link>
                <p className="font-body text-sm text-nude-500 line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="font-body text-xs text-nude-400">{post.authorName}</span>
                  <span className="font-body text-xs text-nude-400">
                    {post.publishedAt ? formatDate(post.publishedAt) : ''}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
