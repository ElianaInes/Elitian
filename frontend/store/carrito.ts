import { create } from 'zustand'
import type { Carrito } from '@/lib/types'
import { getCarrito, agregarAlCarrito, actualizarCarrito, eliminarDelCarrito } from '@/lib/api'
import { useAuthStore } from './auth'

interface CarritoStore {
  carrito: Carrito | null
  fetchCarrito: () => Promise<void>
  agregar: (productoId: number, cantidad: number) => Promise<void>
  actualizar: (itemId: number, cantidad: number) => Promise<void>
  eliminar: (itemId: number) => Promise<void>
  cantidadTotal: () => number
}

function getToken(): string | null {
  return useAuthStore.getState().access
}

export const useCarritoStore = create<CarritoStore>()((set, get) => ({
  carrito: null,

  fetchCarrito: async () => {
    const token = getToken()
    if (!token) return
    const carrito = await getCarrito(token)
    set({ carrito })
  },

  agregar: async (productoId: number, cantidad: number) => {
    const token = getToken()
    if (!token) throw new Error('Necesitás iniciar sesión para agregar al carrito.')
    const carrito = await agregarAlCarrito(productoId, cantidad, token)
    set({ carrito })
  },

  actualizar: async (itemId: number, cantidad: number) => {
    const token = getToken()
    if (!token) return
    const carrito = await actualizarCarrito(itemId, cantidad, token)
    set({ carrito })
  },

  eliminar: async (itemId: number) => {
    const token = getToken()
    if (!token) return
    const carrito = await eliminarDelCarrito(itemId, token)
    set({ carrito })
  },

  cantidadTotal: () => get().carrito?.cantidad_items ?? 0,
}))
