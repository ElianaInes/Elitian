import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Elitian — Productos naturales',
    short_name: 'Elitian',
    description: 'Tienda de productos naturales y ecológicos para el cuidado personal.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf8f4',
    theme_color: '#2e7280',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
