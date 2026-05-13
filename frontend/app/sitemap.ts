import type { MetadataRoute } from 'next'
import { getProductos, getCategorias, getBlogPosts } from '@/lib/api'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://elitian.com.ar'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productosData, categorias, blogData] = await Promise.all([
    getProductos({ con_stock: true }).catch(() => ({ results: [] })),
    getCategorias().catch(() => []),
    getBlogPosts().catch(() => ({ results: [], count: 0, next: null, previous: null })),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/tienda`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/conocenos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/recicla`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contacto`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  const categoriaRoutes: MetadataRoute.Sitemap = categorias.map((cat) => ({
    url: `${SITE_URL}/tienda/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const productoRoutes: MetadataRoute.Sitemap = productosData.results.map((p) => ({
    url: `${SITE_URL}/tienda/${p.categoria_slug}/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const blogRoutes: MetadataRoute.Sitemap = blogData.results.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.creado),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...categoriaRoutes, ...productoRoutes, ...blogRoutes]
}
