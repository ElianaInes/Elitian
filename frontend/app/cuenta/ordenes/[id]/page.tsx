'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { getOrden } from '@/lib/api'
import type { Orden } from '@/lib/types'

const ESTADO_COLORES: Record<string, string> = {
  pendiente:  'bg-yellow-100 text-yellow-700',
  confirmado: 'bg-blue-100 text-blue-700',
  enviado:    'bg-purple-100 text-purple-700',
  entregado:  'bg-green-100 text-green-700',
  cancelado:  'bg-red-100 text-red-700',
}

const ESTADO_PASOS = ['pendiente', 'confirmado', 'enviado', 'entregado']

export default function OrdenDetallePage() {
  const { id } = useParams<{ id: string }>()
  const { access, estaAutenticado } = useAuthStore()
  const router = useRouter()
  const [orden, setOrden] = useState<Orden | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!estaAutenticado()) {
      router.replace('/cuenta/login?next=/cuenta/ordenes')
      return
    }
    if (!access || !id) return
    getOrden(Number(id), access)
      .then(setOrden)
      .catch(() => setError('No pudimos cargar este pedido.'))
  }, [access, estaAutenticado, id, router])

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-red-500 text-sm mb-4">{error}</p>
        <Link href="/cuenta/ordenes" className="text-green-700 hover:underline text-sm">
          ← Volver a mis pedidos
        </Link>
      </div>
    )
  }

  if (!orden) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-3 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-stone-500 text-sm">Cargando pedido...</p>
      </div>
    )
  }

  const pasoActual = ESTADO_PASOS.indexOf(orden.estado)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/cuenta/ordenes"
            className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
          >
            ← Mis pedidos
          </Link>
          <h1 className="text-2xl font-semibold text-stone-800 mt-1">Pedido #{orden.id}</h1>
          <p className="text-xs text-stone-400 mt-0.5">
            {new Date(orden.creado).toLocaleDateString('es-AR', {
              weekday: 'long',
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <span
          className={`text-sm font-semibold px-3 py-1.5 rounded-full ${
            ESTADO_COLORES[orden.estado] ?? 'bg-stone-100 text-stone-600'
          }`}
        >
          {orden.estado_display}
        </span>
      </div>

      {/* Barra de progreso (solo si no está cancelado) */}
      {orden.estado !== 'cancelado' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <div className="relative flex items-center justify-between">
            {/* línea de fondo */}
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-stone-200 -z-10" />
            {/* línea de progreso */}
            <div
              className="absolute left-0 top-4 h-0.5 bg-green-500 -z-10 transition-all duration-500"
              style={{ width: pasoActual >= 0 ? `${(pasoActual / (ESTADO_PASOS.length - 1)) * 100}%` : '0%' }}
            />
            {ESTADO_PASOS.map((paso, i) => {
              const completado = i <= pasoActual
              const actual = i === pasoActual
              return (
                <div key={paso} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      completado
                        ? 'bg-green-600 text-white'
                        : 'bg-stone-200 text-stone-400'
                    } ${actual ? 'ring-4 ring-green-100' : ''}`}
                  >
                    {completado && i < pasoActual ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className={`text-xs capitalize ${completado ? 'text-green-700 font-medium' : 'text-stone-400'}`}>
                    {paso}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Productos */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
        <h2 className="font-semibold text-stone-800 mb-4">Productos</h2>
        <div className="divide-y divide-stone-100">
          {orden.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3.5 text-sm">
              <div className="flex-1 min-w-0 pr-4">
                <p className="font-medium text-stone-800">{item.producto_nombre}</p>
                <p className="text-stone-400 text-xs mt-0.5">
                  x{item.cantidad} · ${item.precio_unitario} c/u
                </p>
              </div>
              <p className="font-semibold text-stone-700 flex-shrink-0">${item.subtotal}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-stone-100 pt-4 mt-2 flex justify-between font-bold text-stone-800">
          <span>Total</span>
          <span>${orden.total}</span>
        </div>
      </div>

      {/* Notas */}
      {orden.notas && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <h2 className="font-semibold text-stone-800 mb-3">Notas del pedido</h2>
          <p className="text-sm text-stone-600 whitespace-pre-line leading-relaxed">{orden.notas}</p>
        </div>
      )}

      {/* CTA WhatsApp */}
      <div className="bg-green-50 rounded-2xl border border-green-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-stone-800 text-sm">¿Tenés alguna consulta?</p>
          <p className="text-xs text-stone-500 mt-0.5">Te respondemos por WhatsApp a la brevedad.</p>
        </div>
        <a
          href="https://wa.me/543624000000"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold text-sm rounded-xl transition-colors flex-shrink-0"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Contactar
        </a>
      </div>

    </div>
  )
}
