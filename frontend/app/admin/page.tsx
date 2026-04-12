'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { getAdminStats } from '@/lib/api'
import type { AdminStats } from '@/lib/api'

const ESTADO_COLORES: Record<string, string> = {
  pendiente:  'bg-yellow-400',
  confirmado: 'bg-blue-400',
  enviado:    'bg-purple-400',
  entregado:  'bg-green-500',
  cancelado:  'bg-red-400',
}

const ESTADO_LABELS: Record<string, string> = {
  pendiente:  'Pendiente',
  confirmado: 'Confirmado',
  enviado:    'Enviado',
  entregado:  'Entregado',
  cancelado:  'Cancelado',
}

function Stat({ label, value, sub, color = 'text-stone-800' }: {
  label: string
  value: string | number
  sub?: string
  color?: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5">
      <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const { access } = useAuthStore()
  const [stats, setStats] = useState<AdminStats | null>(null)

  useEffect(() => {
    if (!access) return
    getAdminStats(access).then(setStats).catch(() => null)
  }, [access])

  if (!stats) {
    return (
      <div className="p-10 flex items-center gap-3 text-stone-400">
        <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
        Cargando métricas...
      </div>
    )
  }

  const totalEstados = stats.estados.reduce((s, e) => s + e.cantidad, 0) || 1

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-stone-800 mb-1">Dashboard</h1>
      <p className="text-sm text-stone-400 mb-8">Resumen general de la tienda</p>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat label="Pedidos totales" value={stats.ordenes_total} />
        <Stat
          label="Pendientes"
          value={stats.ordenes_pendientes}
          color={stats.ordenes_pendientes > 0 ? 'text-yellow-600' : 'text-stone-800'}
        />
        <Stat label="Pedidos este mes" value={stats.ordenes_mes} />
        <Stat label="Clientes" value={stats.usuarios_total} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat
          label="Ventas totales"
          value={`$${Number(stats.ventas_total).toLocaleString('es-AR')}`}
        />
        <Stat
          label="Ventas este mes"
          value={`$${Number(stats.ventas_mes).toLocaleString('es-AR')}`}
          color="text-green-700"
        />
        <Stat label="Productos" value={stats.productos_total} />
        <Stat
          label="Sin stock"
          value={stats.productos_sin_stock}
          color={stats.productos_sin_stock > 0 ? 'text-red-600' : 'text-stone-800'}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Distribución de estados */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Estado de pedidos</h2>
          <div className="space-y-3">
            {stats.estados.map(({ estado, cantidad }) => (
              <div key={estado}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stone-600">{ESTADO_LABELS[estado] ?? estado}</span>
                  <span className="font-semibold text-stone-800">{cantidad}</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${ESTADO_COLORES[estado] ?? 'bg-stone-400'}`}
                    style={{ width: `${(cantidad / totalEstados) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Acciones rápidas</h2>
          <div className="space-y-3">
            <Link
              href="/admin/ordenes?estado=pendiente"
              className="flex items-center justify-between p-4 rounded-xl bg-yellow-50 border border-yellow-100 hover:border-yellow-300 transition-colors"
            >
              <div>
                <p className="font-medium text-stone-800 text-sm">Pedidos pendientes</p>
                <p className="text-xs text-stone-400 mt-0.5">Requieren atención</p>
              </div>
              <span className="text-lg font-bold text-yellow-600">{stats.ordenes_pendientes}</span>
            </Link>

            <Link
              href="/admin/productos?activo=false"
              className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100 hover:border-red-300 transition-colors"
            >
              <div>
                <p className="font-medium text-stone-800 text-sm">Productos sin stock</p>
                <p className="text-xs text-stone-400 mt-0.5">Stock en 0</p>
              </div>
              <span className="text-lg font-bold text-red-600">{stats.productos_sin_stock}</span>
            </Link>

            <Link
              href="/admin/ordenes"
              className="flex items-center justify-between p-4 rounded-xl bg-stone-50 border border-stone-200 hover:border-stone-300 transition-colors"
            >
              <div>
                <p className="font-medium text-stone-800 text-sm">Ver todos los pedidos</p>
                <p className="text-xs text-stone-400 mt-0.5">Gestionar estados</p>
              </div>
              <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
