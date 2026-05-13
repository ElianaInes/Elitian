import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { login as apiLogin, registro as apiRegistro, getMe } from '@/lib/api'
import type { AuthResponse } from '@/lib/api'

async function fetchUsuario(access: string) {
  try {
    return await getMe(access)
  } catch {
    return null
  }
}

interface Usuario {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_staff: boolean
}

interface AuthStore {
  access: string | null
  refresh: string | null
  usuario: Usuario | null
  login: (username: string, password: string) => Promise<void>
  registro: (data: {
    username: string
    email: string
    password: string
    first_name: string
    last_name: string
  }) => Promise<void>
  logout: () => void
  cargarUsuario: () => Promise<void>
  estaAutenticado: () => boolean
}

function aplicarAuth(set: (s: Partial<AuthStore>) => void, data: AuthResponse) {
  set({
    access: data.access,
    refresh: data.refresh,
    usuario: data.user ?? null,
  })
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      access: null,
      refresh: null,
      usuario: null,

      login: async (username, password) => {
        const data = await apiLogin(username, password)
        aplicarAuth(set, data)
        if (!data.user) {
          const usuario = await fetchUsuario(data.access)
          set({ usuario: usuario ?? null })
        }
      },

      registro: async (formData) => {
        const data = await apiRegistro(formData)
        aplicarAuth(set, data)
        if (!data.user) {
          const usuario = await fetchUsuario(data.access)
          set({ usuario: usuario ?? null })
        }
      },

      logout: () => {
        set({ access: null, refresh: null, usuario: null })
      },

      cargarUsuario: async () => {
        const { access } = get()
        if (!access || get().usuario) return
        try {
          const usuario = await getMe(access)
          set({ usuario: usuario ?? null })
        } catch {
          set({ access: null, refresh: null, usuario: null })
        }
      },

      estaAutenticado: () => Boolean(get().access),
    }),
    {
      name: 'elitian-auth',
      partialize: (s) => ({ access: s.access, refresh: s.refresh, usuario: s.usuario }),
    },
  ),
)
