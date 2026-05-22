'use client'

import { useState } from 'react'
import { enviarContacto } from '@/lib/api'

export default function FormularioContacto() {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' })
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setError('')
    try {
      await enviarContacto(form)
      setEnviado(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar el mensaje. Intentá de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-3xl px-8 py-12 text-center">
        <p className="text-4xl mb-4">💚</p>
        <h2 className="text-2xl font-semibold text-stone-800 mb-3">¡Mensaje recibido!</h2>
        <p className="text-stone-600 max-w-md mx-auto leading-relaxed">
          Gracias por escribirnos, {form.nombre}. Te respondemos a la brevedad.
        </p>
      </div>
    )
  }

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-stone-800 mb-3">Envianos un mensaje</h2>
        <p className="text-stone-500">Completá el formulario y te respondemos a la brevedad.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-3xl p-8 space-y-5 max-w-xl mx-auto">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Nombre</label>
          <input
            type="text"
            name="nombre"
            required
            value={form.nombre}
            onChange={handleChange}
            placeholder="Tu nombre"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Mensaje</label>
          <textarea
            name="mensaje"
            required
            value={form.mensaje}
            onChange={handleChange}
            rows={4}
            placeholder="Contanos en qué podemos ayudarte..."
            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="w-full py-3 rounded-xl bg-green-700 hover:bg-green-800 text-white font-semibold text-sm transition-colors disabled:opacity-50"
        >
          {enviando ? 'Enviando...' : 'Enviar mensaje'}
        </button>
      </form>
    </section>
  )
}
