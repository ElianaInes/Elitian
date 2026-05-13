import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

export const metadata: Metadata = {
  title: {
    default: 'Elitian — Productos naturales y ecológicos',
    template: '%s | Elitian',
  },
  description:
    'Tienda online de productos naturales y ecológicos para el cuidado personal. Consumo consciente, bienestar real.',
  keywords: ['productos naturales', 'ecológicos', 'cuidado personal', 'orgánico', 'Resistencia'],
  openGraph: {
    siteName: 'Elitian',
    locale: 'es_AR',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-background text-stone-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
