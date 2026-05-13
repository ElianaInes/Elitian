import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-black text-green-200 mb-2">404</p>
      <h1 className="text-2xl font-bold text-stone-800 mb-2">Página no encontrada</h1>
      <p className="text-stone-500 mb-8 max-w-sm">
        La página que buscás no existe o fue movida.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors text-sm"
        >
          Ir al inicio
        </Link>
        <Link
          href="/tienda"
          className="px-6 py-3 border border-stone-300 text-stone-700 font-medium rounded-xl hover:bg-stone-50 transition-colors text-sm"
        >
          Ver tienda
        </Link>
      </div>
    </div>
  )
}
