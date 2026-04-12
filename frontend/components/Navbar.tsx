import Image from 'next/image'
import Link from 'next/link'
import { getCategorias } from '@/lib/api'
import NavbarClient from './NavbarClient'

export default async function Navbar() {
  const categorias = await getCategorias().catch(() => [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Elitian"
            width={110}
            height={36}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-stone-600">
          <Link href="/" className="px-3 py-2 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors">
            Inicio
          </Link>
          <Link href="/conocenos" className="px-3 py-2 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors">
            Conocénos
          </Link>

          {/* Dropdown Tienda */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors">
              Tienda
              <svg className="w-3.5 h-3.5 mt-0.5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Menú desplegable */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
              <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-2 min-w-[200px]">
                <Link
                  href="/tienda"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-stone-600 hover:bg-green-50 hover:text-green-700 transition-colors font-medium"
                >
                  Ver todo
                </Link>
                <div className="my-1 border-t border-stone-100" />
                {categorias.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/tienda/${cat.slug}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-stone-600 hover:bg-green-50 hover:text-green-700 transition-colors"
                  >
                    <span className="text-green-600">›</span>
                    {cat.nombre}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/recicla" className="px-3 py-2 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors">
            Reciclá
          </Link>
          <Link href="/blog" className="px-3 py-2 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors">
            Blog
          </Link>
          <Link href="/contacto" className="px-3 py-2 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors">
            Contacto
          </Link>
        </nav>

        {/* Acciones (carrito + mobile trigger) — client */}
        <NavbarClient categorias={categorias} />
      </div>
    </header>
  )
}
