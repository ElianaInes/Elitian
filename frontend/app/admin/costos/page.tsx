'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '@/store/auth'
import {
  getCostosGlobal, updateCostosGlobal,
  getCostesCategorias, saveCostoCategoria, deleteCostoCategoria,
  getPromocionBancos, crearPromocionBanco, updatePromocionBanco, deletePromocionBanco,
} from '@/lib/api'
import type {
  ConfiguracionGlobal, CategoriaConCosto, PromocionBanco, IVAOpcion,
} from '@/lib/types'

type Tab = 'global' | 'categorias' | 'bancos'

const IVA_OPTIONS: { value: IVAOpcion | ''; label: string }[] = [
  { value: '', label: '— Usar global —' },
  { value: '0', label: '0% — Exento' },
  { value: '10.5', label: '10.5% — Tasa reducida' },
  { value: '21', label: '21% — Tasa general' },
]

const IVA_OPTIONS_REQUIRED: { value: IVAOpcion; label: string }[] = [
  { value: '0', label: '0% — Exento' },
  { value: '10.5', label: '10.5% — Tasa reducida' },
  { value: '21', label: '21% — Tasa general' },
]

const inputCls = 'w-full px-3 py-2 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500'
const labelCls = 'text-xs font-medium text-stone-500 uppercase tracking-wide mb-1 block'

// ── Tab Global ────────────────────────────────────────────────────────────────

function TabGlobal({ token }: { token: string }) {
  const [cfg, setCfg] = useState<ConfiguracionGlobal | null>(null)
  const [form, setForm] = useState({ margen_ganancia: '', iva: '21' as IVAOpcion, recargo_tarjeta: '', transporte: '' })
  const [guardando, setGuardando] = useState(false)
  const [ok, setOk] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCostosGlobal(token).then((data) => {
      setCfg(data)
      setForm({
        margen_ganancia: data.margen_ganancia,
        iva: data.iva,
        recargo_tarjeta: data.recargo_tarjeta,
        transporte: data.transporte,
      })
    })
  }, [token])

  async function handleGuardar() {
    setGuardando(true)
    setError(null)
    setOk(false)
    try {
      const updated = await updateCostosGlobal(token, form)
      setCfg(updated)
      setOk(true)
      setTimeout(() => setOk(false), 3000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar')
    } finally {
      setGuardando(false)
    }
  }

  if (!cfg) return <div className="py-16 text-center text-stone-400 text-sm">Cargando...</div>

  return (
    <div className="max-w-lg">
      <p className="text-sm text-stone-500 mb-6">
        Estos valores se aplican a todos los productos que no tienen configuración propia o por categoría.
      </p>

      {error && <div className="mb-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
      {ok && <div className="mb-4 bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl">Configuración guardada correctamente.</div>}

      <div className="space-y-4">
        <div>
          <label className={labelCls}>Margen de ganancia global (%)</label>
          <input
            type="number" min="0" step="0.01"
            value={form.margen_ganancia}
            onChange={(e) => setForm((p) => ({ ...p, margen_ganancia: e.target.value }))}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>IVA global</label>
          <select
            value={form.iva}
            onChange={(e) => setForm((p) => ({ ...p, iva: e.target.value as IVAOpcion }))}
            className={`${inputCls} bg-white`}
          >
            {IVA_OPTIONS_REQUIRED.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Recargo tarjeta de crédito (%)</label>
          <input
            type="number" min="0" step="0.01"
            value={form.recargo_tarjeta}
            onChange={(e) => setForm((p) => ({ ...p, recargo_tarjeta: e.target.value }))}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Costo de transporte fijo ($)</label>
          <input
            type="number" min="0" step="0.01"
            value={form.transporte}
            onChange={(e) => setForm((p) => ({ ...p, transporte: e.target.value }))}
            className={inputCls}
          />
        </div>
      </div>

      <button
        onClick={handleGuardar}
        disabled={guardando}
        className="mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold bg-stone-900 text-white hover:bg-stone-700 disabled:opacity-50 transition-colors flex items-center gap-2"
      >
        {guardando && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
        {guardando ? 'Guardando...' : 'Guardar configuración global'}
      </button>
    </div>
  )
}

// ── Tab Categorías ────────────────────────────────────────────────────────────

function TabCategorias({ token }: { token: string }) {
  const [categorias, setCategorias] = useState<CategoriaConCosto[]>([])
  const [cargando, setCargando] = useState(true)
  const [editando, setEditando] = useState<number | null>(null)
  const [forms, setForms] = useState<Record<number, { margen_ganancia: string; iva: string }>>({})
  const [guardando, setGuardando] = useState<number | null>(null)
  const [eliminando, setEliminando] = useState<number | null>(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const data = await getCostesCategorias(token)
      setCategorias(data)
    } finally {
      setCargando(false)
    }
  }, [token])

  useEffect(() => { cargar() }, [cargar])

  function iniciarEdicion(cat: CategoriaConCosto) {
    setEditando(cat.id)
    setForms((p) => ({
      ...p,
      [cat.id]: {
        margen_ganancia: cat.config_costo?.margen_ganancia ?? '',
        iva: cat.config_costo?.iva ?? '',
      },
    }))
  }

  async function handleGuardar(catId: number) {
    setGuardando(catId)
    try {
      await saveCostoCategoria(token, catId, forms[catId])
      await cargar()
      setEditando(null)
    } catch {
      // show nothing, leave form open
    } finally {
      setGuardando(null)
    }
  }

  async function handleEliminar(catId: number) {
    if (!confirm('¿Quitar configuración de margen para esta categoría? Usará el global.')) return
    setEliminando(catId)
    try {
      await deleteCostoCategoria(token, catId)
      await cargar()
    } finally {
      setEliminando(null)
    }
  }

  if (cargando) return <div className="py-16 text-center text-stone-400 text-sm">Cargando...</div>

  return (
    <div>
      <p className="text-sm text-stone-500 mb-6">
        Configurá un margen e IVA específico por categoría. Si no hay configuración, se usa el global.
      </p>
      <div className="space-y-3">
        {categorias.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl border border-stone-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-stone-800 text-sm">{cat.nombre}</p>
                {cat.config_costo ? (
                  <p className="text-xs text-stone-400 mt-0.5">
                    Margen: {cat.config_costo.margen_ganancia}%
                    {cat.config_costo.iva ? ` · IVA: ${cat.config_costo.iva}%` : ' · IVA: global'}
                  </p>
                ) : (
                  <p className="text-xs text-stone-400 mt-0.5">Sin configuración propia — usa global</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => editando === cat.id ? setEditando(null) : iniciarEdicion(cat)}
                  className="text-xs font-medium text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  {editando === cat.id ? 'Cancelar' : cat.config_costo ? 'Editar' : 'Configurar'}
                </button>
                {cat.config_costo && (
                  <button
                    onClick={() => handleEliminar(cat.id)}
                    disabled={eliminando === cat.id}
                    className="text-xs font-medium text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-40"
                  >
                    Quitar
                  </button>
                )}
              </div>
            </div>

            {editando === cat.id && (
              <div className="border-t border-stone-100 pt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Margen de ganancia (%)</label>
                  <input
                    type="number" min="0" step="0.01"
                    value={forms[cat.id]?.margen_ganancia ?? ''}
                    onChange={(e) => setForms((p) => ({ ...p, [cat.id]: { ...p[cat.id], margen_ganancia: e.target.value } }))}
                    className={inputCls}
                    placeholder="ej: 35"
                  />
                </div>
                <div>
                  <label className={labelCls}>IVA específico</label>
                  <select
                    value={forms[cat.id]?.iva ?? ''}
                    onChange={(e) => setForms((p) => ({ ...p, [cat.id]: { ...p[cat.id], iva: e.target.value } }))}
                    className={`${inputCls} bg-white`}
                  >
                    {IVA_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 flex justify-end">
                  <button
                    onClick={() => handleGuardar(cat.id)}
                    disabled={guardando === cat.id}
                    className="px-5 py-2 rounded-xl text-sm font-semibold bg-stone-900 text-white hover:bg-stone-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {guardando === cat.id && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                    Guardar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Tab Bancos ────────────────────────────────────────────────────────────────

const PROMO_INICIAL = { nombre: '', banco: '', tipo: 'descuento' as 'descuento' | 'cuotas', valor: '0', activo: true, vigencia_desde: '', vigencia_hasta: '', descripcion: '' }

function TabBancos({ token }: { token: string }) {
  const [promos, setPromos] = useState<PromocionBanco[]>([])
  const [cargando, setCargando] = useState(true)
  const [form, setForm] = useState(PROMO_INICIAL)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState<number | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)

  const cargar = useCallback(async () => {
    setCargando(true)
    try { setPromos(await getPromocionBancos(token)) }
    finally { setCargando(false) }
  }, [token])

  useEffect(() => { cargar() }, [cargar])

  function abrirNuevo() {
    setEditandoId(null)
    setForm(PROMO_INICIAL)
    setMostrarForm(true)
  }

  function abrirEditar(p: PromocionBanco) {
    setEditandoId(p.id)
    setForm({
      nombre: p.nombre,
      banco: p.banco,
      tipo: p.tipo,
      valor: p.valor,
      activo: p.activo,
      vigencia_desde: p.vigencia_desde ?? '',
      vigencia_hasta: p.vigencia_hasta ?? '',
      descripcion: p.descripcion,
    })
    setMostrarForm(true)
  }

  async function handleGuardar() {
    setGuardando(true)
    try {
      const payload = {
        ...form,
        vigencia_desde: form.vigencia_desde || null,
        vigencia_hasta: form.vigencia_hasta || null,
      }
      if (editandoId) {
        await updatePromocionBanco(token, editandoId, payload)
      } else {
        await crearPromocionBanco(token, payload as Parameters<typeof crearPromocionBanco>[1])
      }
      await cargar()
      setMostrarForm(false)
    } catch {
      // keep form open
    } finally {
      setGuardando(false)
    }
  }

  async function handleEliminar(id: number, nombre: string) {
    if (!confirm(`¿Eliminar la promoción "${nombre}"?`)) return
    setEliminando(id)
    try { await deletePromocionBanco(token, id); await cargar() }
    finally { setEliminando(null) }
  }

  async function toggleActivo(p: PromocionBanco) {
    await updatePromocionBanco(token, p.id, { activo: !p.activo })
    setPromos((prev) => prev.map((x) => x.id === p.id ? { ...x, activo: !x.activo } : x))
  }

  if (cargando) return <div className="py-16 text-center text-stone-400 text-sm">Cargando...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-stone-500">Descuentos y cuotas sin interés por banco.</p>
        <button
          onClick={abrirNuevo}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-700 transition-colors"
        >
          <span className="text-base leading-none">+</span>
          Nueva promoción
        </button>
      </div>

      {mostrarForm && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <h3 className="font-semibold text-stone-800 text-sm mb-5">
            {editandoId ? 'Editar promoción' : 'Nueva promoción bancaria'}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Nombre de la promoción</label>
              <input type="text" value={form.nombre} onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))} className={inputCls} placeholder="ej: 3 cuotas sin interés" />
            </div>
            <div>
              <label className={labelCls}>Banco</label>
              <input type="text" value={form.banco} onChange={(e) => setForm((p) => ({ ...p, banco: e.target.value }))} className={inputCls} placeholder="ej: Galicia, BBVA..." />
            </div>
            <div>
              <label className={labelCls}>Tipo</label>
              <select value={form.tipo} onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value as 'descuento' | 'cuotas' }))} className={`${inputCls} bg-white`}>
                <option value="descuento">Descuento (%)</option>
                <option value="cuotas">Cuotas sin interés</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>{form.tipo === 'descuento' ? 'Descuento (%)' : 'Cantidad de cuotas'}</label>
              <input type="number" min="0" step="0.01" value={form.valor} onChange={(e) => setForm((p) => ({ ...p, valor: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Vigencia desde</label>
              <input type="date" value={form.vigencia_desde} onChange={(e) => setForm((p) => ({ ...p, vigencia_desde: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Vigencia hasta</label>
              <input type="date" value={form.vigencia_hasta} onChange={(e) => setForm((p) => ({ ...p, vigencia_hasta: e.target.value }))} className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Descripción</label>
              <input type="text" value={form.descripcion} onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))} className={inputCls} placeholder="Descripción opcional" />
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.activo} onChange={(e) => setForm((p) => ({ ...p, activo: e.target.checked }))} className="accent-green-600 w-4 h-4" />
                <span className="text-sm text-stone-700">Promoción activa</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-5 pt-5 border-t border-stone-100">
            <button onClick={() => setMostrarForm(false)} className="px-5 py-2 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors">Cancelar</button>
            <button onClick={handleGuardar} disabled={guardando} className="px-6 py-2 rounded-xl text-sm font-semibold bg-stone-900 text-white hover:bg-stone-700 disabled:opacity-50 transition-colors flex items-center gap-2">
              {guardando && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              {guardando ? 'Guardando...' : editandoId ? 'Actualizar' : 'Crear promoción'}
            </button>
          </div>
        </div>
      )}

      {promos.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <p className="text-4xl mb-3">🏦</p>
          <p className="text-sm font-medium">Sin promociones bancarias</p>
        </div>
      ) : (
        <div className="space-y-3">
          {promos.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-stone-200 p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.tipo === 'descuento' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                    {p.tipo === 'descuento' ? `${p.valor}% OFF` : `${p.valor} cuotas s/i`}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.activo ? 'bg-stone-100 text-stone-600' : 'bg-red-50 text-red-500'}`}>
                    {p.activo ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                <p className="font-medium text-stone-800 text-sm">{p.nombre}</p>
                <p className="text-xs text-stone-400">{p.banco}{p.vigencia_hasta ? ` · hasta ${p.vigencia_hasta}` : ''}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleActivo(p)} className="text-xs text-stone-500 hover:text-stone-800 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                  {p.activo ? 'Desactivar' : 'Activar'}
                </button>
                <button onClick={() => abrirEditar(p)} className="text-xs font-medium text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                  Editar
                </button>
                <button onClick={() => handleEliminar(p.id, p.nombre)} disabled={eliminando === p.id} className="text-xs font-medium text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-40">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminCostosPage() {
  const { access } = useAuthStore()
  const [tab, setTab] = useState<Tab>('global')

  const TABS: { id: Tab; label: string }[] = [
    { id: 'global', label: 'Configuración global' },
    { id: 'categorias', label: 'Por categoría' },
    { id: 'bancos', label: 'Promociones bancarias' },
  ]

  if (!access) return null

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-800 mb-1">Estructura de costos</h1>
        <p className="text-sm text-stone-400">Margen, IVA, transporte, tarjeta y promociones bancarias</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 mb-8 gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === t.id
                ? 'border-green-500 text-green-700'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'global' && <TabGlobal token={access} />}
      {tab === 'categorias' && <TabCategorias token={access} />}
      {tab === 'bancos' && <TabBancos token={access} />}
    </div>
  )
}
