import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProducto, getProductosRelacionados, getResenas } from '@/lib/api'
import BotonAgregarCarrito from './_components/BotonAgregarCarrito'
import GaleriaImagenes from './_components/GaleriaImagenes'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ categoria: string; producto: string }>
}

export default async function ProductoPage({ params }: Props) {
  const { categoria: categoriaSlug, producto: productoSlug } = await params

  const [producto, relacionados, resenas] = await Promise.all([
    getProducto(productoSlug).catch(() => null),
    getProductosRelacionados(productoSlug).catch(() => []),
    getResenas(productoSlug).catch(() => []),
  ])

  if (!producto) notFound()

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-stone-500 mb-8">
        <Link href="/tienda" className="hover:text-green-700">Tienda</Link>
        <span className="mx-2">/</span>
        <Link href={`/tienda/${categoriaSlug}`} className="hover:text-green-700 capitalize">
          {producto.categoria.nombre}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-stone-800">{producto.nombre}</span>
      </nav>

      {/* Producto principal */}
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        <GaleriaImagenes imagenes={producto.imagenes} nombre={producto.nombre} />

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm text-stone-500 mb-1">SKU: {producto.codigo} · {producto.marca}</p>
            {producto.ofrecido && (
              <p className="text-sm text-stone-500">Ofrecido por <span className="font-medium">{producto.ofrecido}</span></p>
            )}
          </div>

          <h1 className="text-3xl font-semibold text-stone-800">{producto.nombre}</h1>

          {/* Precio */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-green-700">${producto.precio_final}</span>
            {producto.tiene_oferta && (
              <span className="text-lg text-stone-400 line-through">${producto.precio}</span>
            )}
            {producto.descuento > 0 && (
              <span className="bg-green-100 text-green-700 text-sm font-semibold px-2 py-0.5 rounded-full">
                {producto.descuento}% OFF
              </span>
            )}
          </div>

          {/* Métodos de pago */}
          <div className="bg-stone-50 rounded-xl p-4 text-sm text-stone-600 space-y-1">
            <p>💳 Mismo precio en <span className="font-medium">3 cuotas sin interés</span></p>
            <p>💵 Efectivo / transferencia: <span className="font-medium text-green-700">20% OFF</span></p>
          </div>

          {/* Envíos */}
          <div className="bg-green-50 rounded-xl p-4 text-sm text-stone-600">
            <p>🚚 <span className="font-medium">Envíos gratis</span> en compras +$10.000 (Resistencia)</p>
          </div>

          {/* Stock */}
          <p className={`text-sm font-medium ${producto.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {producto.stock > 0 ? `✓ En stock (${producto.stock} disponibles)` : '✗ Sin stock'}
          </p>

          <BotonAgregarCarrito producto={producto} />
        </div>
      </div>

      {/* Descripción y detalles */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {producto.descripcion && (
          <div>
            <h2 className="font-semibold text-stone-800 mb-2">Descripción</h2>
            <p className="text-stone-600 text-sm leading-relaxed">{producto.descripcion}</p>
          </div>
        )}
        {producto.ingredientes && (
          <div>
            <h2 className="font-semibold text-stone-800 mb-2">Ingredientes</h2>
            <p className="text-stone-600 text-sm leading-relaxed">{producto.ingredientes}</p>
          </div>
        )}
        {producto.modo_uso && (
          <div>
            <h2 className="font-semibold text-stone-800 mb-2">Modo de uso</h2>
            <p className="text-stone-600 text-sm leading-relaxed">{producto.modo_uso}</p>
          </div>
        )}
        {producto.conservacion && (
          <div>
            <h2 className="font-semibold text-stone-800 mb-2">Conservación</h2>
            <p className="text-stone-600 text-sm leading-relaxed">{producto.conservacion}</p>
          </div>
        )}
      </div>

      {/* Reseñas */}
      {resenas.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-stone-800 mb-6">
            Reseñas
            {producto.calificacion_promedio && (
              <span className="ml-3 text-base font-normal text-stone-500">
                ★ {producto.calificacion_promedio} ({producto.total_resenas})
              </span>
            )}
          </h2>
          <div className="space-y-4">
            {resenas.map((resena) => (
              <div key={resena.id} className="bg-stone-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-stone-800 text-sm">{resena.usuario_nombre}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={i < resena.calificacion ? 'text-yellow-400' : 'text-stone-300'}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-stone-600 text-sm">{resena.comentario}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Relacionados */}
      {relacionados.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-stone-800 mb-6">También te puede interesar</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {relacionados.map((rel) => (
              <Link
                key={rel.id}
                href={`/tienda/${categoriaSlug}/${rel.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square bg-stone-50">
                  {rel.imagen_principal ? (
                    <Image src={rel.imagen_principal} alt={rel.nombre} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300 text-3xl">🌿</div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-stone-800 line-clamp-2 mb-1">{rel.nombre}</p>
                  <span className="text-green-700 font-semibold text-sm">${rel.precio_final}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
