'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { updateMe, cambiarPassword } from '@/lib/api'

export default function PerfilPage() {
  const { access, usuario, estaAutenticado } = useAuthStore()
  const router = useRouter()

  // ── Datos personales ──────────────────────────────────────────────────────
  const [perfil, setPerfil] = useState({
    first_name: '',
    last_name: '',
    email: '',
  })
  const [perfilErrores, setPerfilErrores] = useState<Record<string, string>>({})
  const [perfilExito, setPerfilExito] = useState(false)
  const [perfilCargando, setPerfilCargando] = useState(false)

  // ── Cambio de contraseña ──────────────────────────────────────────────────
  const [pass, setPass] = useState({
    password_actual: '',
    password_nueva: '',
    password_nueva2: '',
  })
  const [passErrores, setPassErrores] = useState<Record<string, string>>({})
  const [passExito, setPassExito] = useState(false)
  const [passCargando, setPassCargando] = useState(false)

  useEffect(() => {
    if (!estaAutenticado()) {
      router.replace('/cuenta/login?next=/cuenta/perfil')
      return
    }
    if (usuario) {
      setPerfil({
        first_name: usuario.first_name ?? '',
        last_name: usuario.last_name ?? '',
        email: usuario.email ?? '',
      })
    }
  }, [estaAutenticado, router, usuario])

  // ── Guardar perfil ────────────────────────────────────────────────────────
  async function handleGuardarPerfil(e: React.FormEvent) {
    e.preventDefault()
    if (!access) return
    const errores: Record<string, string> = {}
    if (!perfil.first_name.trim()) errores.first_name = 'El nombre es requerido.'
    if (!perfil.email.trim()) errores.email = 'El email es requerido.'
    else if (!/\S+@\S+\.\S+/.test(perfil.email)) errores.email = 'Email inválido.'
    if (Object.keys(errores).length) { setPerfilErrores(errores); return }

    setPerfilCargando(true)
    setPerfilErrores({})
    setPerfilExito(false)
    try {
      const updated = await updateMe(access, perfil)
      // actualizar store
      useAuthStore.setState((s) => ({ usuario: { ...s.usuario!, ...updated! } }))
      setPerfilExito(true)
      setTimeout(() => setPerfilExito(false), 3000)
    } catch (err: unknown) {
      if (err instanceof Error) {
        try { setPerfilErrores(JSON.parse(err.message)) }
        catch { setPerfilErrores({ general: err.message }) }
      }
    } finally {
      setPerfilCargando(false)
    }
  }

  // ── Cambiar contraseña ────────────────────────────────────────────────────
  async function handleCambiarPass(e: React.FormEvent) {
    e.preventDefault()
    if (!access) return
    const errores: Record<string, string> = {}
    if (!pass.password_actual) errores.password_actual = 'Ingresá tu contraseña actual.'
    if (!pass.password_nueva) errores.password_nueva = 'Ingresá la nueva contraseña.'
    else if (pass.password_nueva.length < 8) errores.password_nueva = 'Mínimo 8 caracteres.'
    else if (pass.password_nueva !== pass.password_nueva2) errores.password_nueva = 'Las contraseñas no coinciden.'
    if (Object.keys(errores).length) { setPassErrores(errores); return }

    setPassCargando(true)
    setPassErrores({})
    setPassExito(false)
    try {
      await cambiarPassword(access, {
        password_actual: pass.password_actual,
        password_nueva: pass.password_nueva,
      })
      setPassExito(true)
      setPass({ password_actual: '', password_nueva: '', password_nueva2: '' })
      setTimeout(() => setPassExito(false), 3000)
    } catch (err: unknown) {
      if (err instanceof Error) {
        try { setPassErrores(JSON.parse(err.message)) }
        catch { setPassErrores({ general: err.message }) }
      }
    } finally {
      setPassCargando(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-stone-800 mb-8">Mi perfil</h1>

      {/* ── Datos personales ── */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
        <h2 className="font-semibold text-stone-800 mb-1">Datos personales</h2>
        <p className="text-xs text-stone-400 mb-5">
          Usuario: <span className="font-medium text-stone-600">@{usuario?.username}</span>
        </p>

        <form onSubmit={handleGuardarPerfil} className="space-y-4">
          {'general' in perfilErrores && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {perfilErrores.general}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <Campo
              label="Nombre"
              value={perfil.first_name}
              onChange={(v) => setPerfil({ ...perfil, first_name: v })}
              error={perfilErrores.first_name}
              placeholder="Juan"
            />
            <Campo
              label="Apellido"
              value={perfil.last_name}
              onChange={(v) => setPerfil({ ...perfil, last_name: v })}
              error={perfilErrores.last_name}
              placeholder="García"
            />
          </div>

          <Campo
            label="Email"
            type="email"
            value={perfil.email}
            onChange={(v) => setPerfil({ ...perfil, email: v })}
            error={perfilErrores.email}
            placeholder="juan@email.com"
          />

          <div className="flex items-center justify-between pt-1">
            {perfilExito && (
              <p className="text-sm text-green-600 font-medium flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Datos guardados
              </p>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                disabled={perfilCargando}
                className="px-6 py-2.5 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold text-sm rounded-xl transition-colors"
              >
                {perfilCargando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ── Cambiar contraseña ── */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="font-semibold text-stone-800 mb-1">Cambiar contraseña</h2>
        <p className="text-xs text-stone-400 mb-5">Elegí una contraseña segura de al menos 8 caracteres.</p>

        <form onSubmit={handleCambiarPass} className="space-y-4">
          {'general' in passErrores && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {passErrores.general}
            </div>
          )}

          <Campo
            label="Contraseña actual"
            type="password"
            value={pass.password_actual}
            onChange={(v) => setPass({ ...pass, password_actual: v })}
            error={passErrores.password_actual}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <Campo
            label="Nueva contraseña"
            type="password"
            value={pass.password_nueva}
            onChange={(v) => setPass({ ...pass, password_nueva: v })}
            error={passErrores.password_nueva}
            placeholder="••••••••"
            autoComplete="new-password"
          />
          <Campo
            label="Repetir nueva contraseña"
            type="password"
            value={pass.password_nueva2}
            onChange={(v) => setPass({ ...pass, password_nueva2: v })}
            placeholder="••••••••"
            autoComplete="new-password"
          />

          <div className="flex items-center justify-between pt-1">
            {passExito && (
              <p className="text-sm text-green-600 font-medium flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Contraseña actualizada
              </p>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                disabled={passCargando}
                className="px-6 py-2.5 bg-stone-800 hover:bg-stone-900 disabled:opacity-60 text-white font-semibold text-sm rounded-xl transition-colors"
              >
                {passCargando ? 'Actualizando...' : 'Cambiar contraseña'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Campo reutilizable ────────────────────────────────────────────────────────

function Campo({
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder = '',
  autoComplete = '',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  type?: string
  placeholder?: string
  autoComplete?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`w-full px-4 py-3 rounded-xl border text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow ${
          error ? 'border-red-400 bg-red-50' : 'border-stone-300'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
