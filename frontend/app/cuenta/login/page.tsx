'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { useCarritoStore } from '@/store/carrito'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const { login, estaAutenticado } = useAuthStore()
  const fetchCarrito = useCarritoStore((s) => s.fetchCarrito)
  const router = useRouter()

  useEffect(() => {
    if (estaAutenticado()) router.replace('/')
  }, [estaAutenticado, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      await login(form.username, form.password)
      await fetchCarrito()
      router.replace('/')
    } catch {
      setError('Usuario o contraseña incorrectos.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image src="/logo.png" alt="Elitian" width={130} height={44} className="h-11 w-auto" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm px-8 py-10">
          <h1 className="text-2xl font-semibold text-stone-800 text-center mb-1">Bienvenido/a</h1>
          <p className="text-stone-500 text-sm text-center mb-8">Ingresá a tu cuenta Elitian</p>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Usuario
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                autoComplete="username"
                placeholder="tu_usuario"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-stone-700">Contraseña</label>
                <Link href="/cuenta/recuperar" className="text-xs text-green-700 hover:text-green-800">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full py-3.5 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors mt-2"
            >
              {cargando ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-stone-500 mt-6">
          ¿No tenés cuenta?{' '}
          <Link href="/cuenta/registro" className="text-green-700 font-semibold hover:text-green-800">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  )
}
