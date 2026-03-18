import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BLOG_POSTS } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find(p => p.slug === params.slug)
  if (!post) notFound()

  return (
    <div className="bg-pearl min-h-screen">
      <div className="container-main py-10 max-w-3xl">
        <nav className="font-body text-xs text-nude-400 mb-8">
          <Link href="/" className="hover:text-charcoal">Ana Sayfa</Link> / <Link href="/blog" className="hover:text-charcoal">Blog</Link> / <span className="text-charcoal">{post.title}</span>
        </nav>
        <div className="flex gap-3 mb-4">{post.tags.map(t => <span key={t} className="font-body text-[10px] uppercase tracking-[0.15em] text-brand-600">{t}</span>)}</div>
        <h1 className="font-display text-4xl md:text-5xl font-light text-charcoal leading-tight mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 mb-8">
          <span className="font-body text-sm text-nude-500">{post.authorName}</span>
          <span className="text-nude-300">·</span>
          <span className="font-body text-sm text-nude-400">{post.publishedAt ? formatDate(post.publishedAt) : ''}</span>
        </div>
        {post.image && (
          <div className="relative aspect-[16/9] overflow-hidden bg-nude-100 mb-10">
            <Image src={post.image} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 780px" />
          </div>
        )}
        <div className="font-body text-nude-700 leading-relaxed space-y-4 prose prose-nude max-w-none">
          <p>{post.excerpt}</p>
          <p>{post.content.replace(/^#.+\n/, '')}</p>
        </div>
      </div>
    </div>
  )
}
