'use client'

import { useState } from 'react'
import type { ProductoDetail } from '@/lib/types'
import { useCarritoStore } from '@/store/carrito'

interface Props {
  producto: ProductoDetail
}

export default function BotonAgregarCarrito({ producto }: Props) {
  const [cantidad, setCantidad] = useState(1)
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const agregar = useCarritoStore((s) => s.agregar)

  if (producto.stock === 0) {
    return (
      <button disabled className="w-full py-3 rounded-xl bg-stone-200 text-stone-500 font-medium cursor-not-allowed">
        Sin stock
      </button>
    )
  }

  const handleAgregar = async () => {
    setCargando(true)
    setMensaje('')
    try {
      await agregar(producto.id, cantidad)
      setMensaje('✓ Agregado al carrito')
      setTimeout(() => setMensaje(''), 2500)
    } catch (err: unknown) {
      setMensaje(err instanceof Error ? err.message : 'Error al agregar')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden">
          <button
            onClick={() => setCantidad((c) => Math.max(1, c - 1))}
            className="px-4 py-2.5 text-stone-600 hover:bg-stone-50 text-lg font-medium"
          >
            −
          </button>
          <span className="px-4 py-2.5 text-stone-800 font-medium min-w-[3rem] text-center">
            {cantidad}
          </span>
          <button
            onClick={() => setCantidad((c) => Math.min(producto.stock, c + 1))}
            className="px-4 py-2.5 text-stone-600 hover:bg-stone-50 text-lg font-medium"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAgregar}
          disabled={cargando}
          className="flex-1 py-3 rounded-xl bg-green-700 hover:bg-green-800 text-white font-semibold transition-colors disabled:opacity-60"
        >
          {cargando ? 'Agregando...' : 'Agregar al carrito'}
        </button>
      </div>
      {mensaje && (
        <p className={`text-sm text-center ${mensaje.startsWith('✓') ? 'text-green-600' : 'text-red-500'}`}>
          {mensaje}
        </p>
      )}
    </div>
  )
}
