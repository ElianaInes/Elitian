'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { getOrden } from '@/lib/api'
import type { Orden } from '@/lib/types'

type MPStatus = 'approved' | 'pending' | 'failure' | string

const CONFIG: Record<string, { titulo: string; subtitulo: string; color: string; icono: string }> = {
  approved: {
    titulo: '¡Pago aprobado!',
    subtitulo: 'Tu pedido fue confirmado. Te avisamos cuando esté en camino.',
    color: 'bg-green-100 text-green-600',
    icono: '✓',
  },
  pending: {
    titulo: 'Pago pendiente',
    subtitulo: 'Tu pago está siendo procesado. Te notificaremos cuando se acredite.',
    color: 'bg-yellow-100 text-yellow-600',
    icono: '⏳',
  },
  failure: {
    titulo: 'El pago no se completó',
    subtitulo: 'Hubo un problema con tu pago. Podés intentarlo de nuevo.',
    color: 'bg-red-100 text-red-600',
    icono: '✕',
  },
}

export default function MPRetornoPage() {
  const searchParams = useSearchParams()
  const mpStatus = (searchParams.get('status') ?? 'failure') as MPStatus
  const ordenId = searchParams.get('orden')
  const { access, usuario } = useAuthStore()
  const [orden, setOrden] = useState<Orden | null>(null)

  useEffect(() => {
    if (!access || !ordenId) return
    getOrden(Number(ordenId), access).then(setOrden).catch(() => null)
  }, [access, ordenId])

  const cfg = CONFIG[mpStatus] ?? CONFIG.failure

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold ${cfg.color}`}>
        {cfg.icono}
      </div>

      <h1 className="text-3xl font-bold text-stone-800 mb-2">{cfg.titulo}</h1>
      <p className="text-stone-500 mb-2">
        {usuario?.first_name ? `${usuario.first_name}, ` : ''}{cfg.subtitulo}
      </p>
      {ordenId && (
        <p className="text-stone-400 text-sm mb-10">Pedido #{ordenId}</p>
      )}

      {orden && mpStatus === 'approved' && (
        <div className="bg-white rounded-2xl border border-stone-200 text-left p-6 mb-8 space-y-4">
          <h2 className="font-semibold text-stone-800">Resumen del pedido</h2>
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
            <span>Total pagado</span>
            <span>${orden.total}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        {mpStatus === 'failure' && (
          <Link
            href="/checkout"
            className="px-6 py-3 rounded-xl bg-green-700 text-white font-medium text-sm hover:bg-green-800 transition-colors"
          >
            Reintentar pago
          </Link>
        )}
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
