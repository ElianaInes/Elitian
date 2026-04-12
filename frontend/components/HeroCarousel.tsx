'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const slides = [
  {
    pc: '/banner-hero.svg',
    mobile: '/banner-hero-mobile.svg',
    alt: 'Productos naturales Elitian',
    titulo: 'Cuidado natural,\nconsumo consciente',
    subtitulo: 'Descubrí nuestra tienda de productos ecológicos para el cuidado personal.',
    cta: { label: 'Ver tienda', href: '/tienda' },
  },
  {
    pc: '/banner-envios.svg',
    mobile: '/banner-envios.svg',
    alt: 'Envíos gratis',
    titulo: 'Envíos gratis\nen Resistencia',
    subtitulo: 'En compras superiores a $10.000 dentro de la ciudad.',
    cta: { label: 'Comprar ahora', href: '/tienda' },
  },
  {
    pc: '/banner-pagos.svg',
    mobile: '/banner-pagos.svg',
    alt: 'Medios de pago',
    titulo: '3 cuotas\nsin interés',
    subtitulo: '20% OFF pagando en efectivo o por transferencia.',
    cta: { label: 'Ver productos', href: '/tienda' },
  },
]

export default function HeroCarousel() {
  const [actual, setActual] = useState(0)
  const [pausado, setPausado] = useState(false)

  const siguiente = useCallback(() => setActual((i) => (i + 1) % slides.length), [])
  const anterior = () => setActual((i) => (i - 1 + slides.length) % slides.length)

  useEffect(() => {
    if (pausado) return
    const t = setInterval(siguiente, 5000)
    return () => clearInterval(t)
  }, [pausado, siguiente])

  return (
    <div
      className="relative w-full overflow-hidden bg-stone-100 select-none"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${actual * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="relative w-full flex-shrink-0">
            {/* Imagen pc */}
            <div className="hidden md:block w-full aspect-[16/5]">
              <Image src={slide.pc} alt={slide.alt} fill className="object-cover" priority={i === 0} />
            </div>
            {/* Imagen mobile */}
            <div className="md:hidden w-full aspect-[4/3]">
              <Image src={slide.mobile} alt={slide.alt} fill className="object-cover" priority={i === 0} />
            </div>

            {/* Overlay de texto */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent flex items-center">
              <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
                <h2 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold leading-tight whitespace-pre-line drop-shadow mb-3">
                  {slide.titulo}
                </h2>
                <p className="text-white/85 text-sm md:text-base max-w-sm mb-5 drop-shadow">
                  {slide.subtitulo}
                </p>
                <Link
                  href={slide.cta.href}
                  className="inline-block px-6 py-2.5 bg-white text-stone-900 font-semibold text-sm rounded-xl hover:bg-green-50 transition-colors shadow"
                >
                  {slide.cta.label}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Flechas */}
      <button
        onClick={anterior}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/70 hover:bg-white flex items-center justify-center shadow transition-colors"
        aria-label="Anterior"
      >
        <svg className="w-4 h-4 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={siguiente}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/70 hover:bg-white flex items-center justify-center shadow transition-colors"
        aria-label="Siguiente"
      >
        <svg className="w-4 h-4 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActual(i)}
            className={`rounded-full transition-all duration-300 ${i === actual ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/50'}`}
            aria-label={`Ir a slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
