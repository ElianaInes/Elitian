import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://elitian.com.ar'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/cuenta/', '/admin/', '/checkout/', '/carrito/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
