'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { getOrden } from '@/lib/api'
import type { Orden } from '@/lib/types'

export default function ExitoPage() {
  const searchParams = useSearchParams()
  const ordenId = searchParams.get('orden')
  const { access, usuario } = useAuthStore()
  const [orden, setOrden] = useState<Orden | null>(null)

  useEffect(() => {
    if (!access || !ordenId) return
    getOrden(Number(ordenId), access)
      .then(setOrden)
      .catch(() => null)
  }, [access, ordenId])

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">

      {/* Ícono animado */}
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-stone-800 mb-2">¡Pedido confirmado!</h1>
      <p className="text-stone-500 mb-2">
        Gracias {usuario?.first_name ?? ''}. Tu pedido #{ordenId} fue recibido con éxito.
      </p>
      <p className="text-stone-400 text-sm mb-10">
        Te contactamos por WhatsApp en breve para coordinar el pago y el envío.
      </p>

      {/* Resumen de la orden */}
      {orden && (
        <div className="bg-white rounded-2xl border border-stone-200 text-left p-6 mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-stone-800">Orden #{orden.id}</h2>
            <EstadoBadge estado={orden.estado} display={orden.estado_display} />
          </div>

          <div className="divide-y divide-stone-100">
            {orden.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-stone-800">{item.producto_nombre}</p>
                  <p className="text-stone-400 text-xs">x{item.cantidad} · ${item.precio_unitario} c/u</p>
                </div>
                <p className="font-semibold text-stone-700">${item.subtotal}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-100 pt-3 flex justify-between font-bold text-stone-800">
            <span>Total</span>
            <span>${orden.total}</span>
          </div>

          {orden.notas && (
            <div className="bg-stone-50 rounded-xl px-4 py-3 text-xs text-stone-600">
              <p className="font-medium text-stone-700 mb-1">Notas</p>
              <p className="whitespace-pre-line">{orden.notas}</p>
            </div>
          )}
        </div>
      )}

      {/* CTA WhatsApp */}
      <a
        href="https://wa.me/543624000000"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold rounded-xl transition-colors mb-4 shadow-sm"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Contactar por WhatsApp
      </a>

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Link
          href="/cuenta/ordenes"
          className="px-6 py-3 rounded-xl border border-stone-300 text-stone-700 font-medium text-sm hover:bg-stone-50 transition-colors"
        >
          Ver mis pedidos
        </Link>
        <Link
          href="/tienda"
          className="px-6 py-3 rounded-xl bg-green-700 text-white font-medium text-sm hover:bg-green-800 transition-colors"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}

function EstadoBadge({ estado, display }: { estado: string; display: string }) {
  const colores: Record<string, string> = {
    pendiente:  'bg-yellow-100 text-yellow-700',
    confirmado: 'bg-blue-100 text-blue-700',
    enviado:    'bg-purple-100 text-purple-700',
    entregado:  'bg-green-100 text-green-700',
    cancelado:  'bg-red-100 text-red-700',
  }
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colores[estado] ?? 'bg-stone-100 text-stone-600'}`}>
      {display}
    </span>
  )
}
