import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { BLOG_POSTS } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Beauty Journal' }

export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS

  return (
    <div className="bg-pearl min-h-screen">
      <div className="bg-nude-100 py-16 border-b border-nude-200">
        <div className="container-main text-center">
          <p className="section-subtitle">Güzellik Rehberi</p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-charcoal">Allorea Dergisi</h1>
          <p className="font-body text-nude-500 mt-4 max-w-lg mx-auto">Allorea ekibinden uzman ipuçları, içerik incelemeleri ve güzellik rutinleri.</p>
        </div>
      </div>

      <div className="container-main py-16">
        {/* Featured post */}
        {featured && (
          <article className="group grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16 pb-16 border-b border-nude-200">
            <Link href={`/blog/${featured.slug}`} className="block overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden bg-nude-100">
                <Image src={featured.image || ''} alt={featured.title} fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="50vw" />
              </div>
            </Link>
            <div>
              <div className="flex gap-3 mb-4">{featured.tags.map(t => <span key={t} className="font-body text-xs uppercase tracking-[0.15em] text-brand-600">{t}</span>)}</div>
              <Link href={`/blog/${featured.slug}`}>
                <h2 className="font-display text-4xl font-light text-charcoal group-hover:text-brand-600 transition-colors leading-snug mb-4">{featured.title}</h2>
              </Link>
              <p className="font-body text-nude-500 leading-relaxed mb-6">{featured.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-nude-400">{featured.authorName}</span>
                <span className="font-body text-sm text-nude-400">{featured.publishedAt ? formatDate(featured.publishedAt) : ''}</span>
              </div>
              <Link href={`/blog/${featured.slug}`} className="inline-flex items-center gap-2 font-body text-sm font-medium mt-5 text-charcoal border-b border-charcoal pb-0.5 hover:text-brand-600 hover:border-brand-600 transition-colors">
                Makaleyi Oku →
              </Link>
            </div>
          </article>
        )}

        {/* Rest of posts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rest.map(post => (
            <article key={post.id} className="group">
              <Link href={`/blog/${post.slug}`} className="block overflow-hidden mb-5">
                <div className="relative aspect-[4/3] overflow-hidden bg-nude-100">
                  <Image src={post.image || ''} alt={post.title} fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="33vw" />
                </div>
              </Link>
              <div className="flex gap-3 mb-3">{post.tags.slice(0, 2).map(t => <span key={t} className="font-body text-[10px] uppercase tracking-[0.15em] text-brand-600">{t}</span>)}</div>
              <Link href={`/blog/${post.slug}`}>
                <h2 className="font-display text-xl font-light text-charcoal group-hover:text-brand-600 transition-colors mb-2">{post.title}</h2>
              </Link>
              <p className="font-body text-sm text-nude-500 line-clamp-2 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="font-body text-xs text-nude-400">{post.authorName}</span>
                <span className="font-body text-xs text-nude-400">{post.publishedAt ? formatDate(post.publishedAt) : ''}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
