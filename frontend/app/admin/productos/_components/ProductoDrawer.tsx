'use client'

import { useState, useEffect } from 'react'
import {
  getCategorias,
  crearProductoAdmin,
  editarProductoAdmin,
  getProductoAdminDetalle,
  getCostoProducto,
  saveCostoProducto,
} from '@/lib/api'
import ImagenesManager from './ImagenesManager'
import type { Categoria, ProductoImagen, CostoProducto, IVAOpcion } from '@/lib/types'

interface ProductoFormData {
  codigo: string
  nombre: string
  categoria: number | ''
  ofrecido: string
  marca: string
  precio: string
  precio_oferta: string
  descripcion: string
  ingredientes: string
  modo_uso: string
  conservacion: string
  cont_peso_neto: string
  destacado: boolean
  activo: boolean
  stock: number
  descuento: number
}

const FORM_INICIAL: ProductoFormData = {
  codigo: '',
  nombre: '',
  categoria: '',
  ofrecido: '',
  marca: '',
  precio: '',
  precio_oferta: '',
  descripcion: '',
  ingredientes: '',
  modo_uso: '',
  conservacion: '',
  cont_peso_neto: '',
  destacado: false,
  activo: true,
  stock: 0,
  descuento: 0,
}

interface Props {
  open: boolean
  productoId: number | null
  token: string
  onClose: () => void
  onSaved: () => void
}

const COSTO_INICIAL = {
  costo_neto: '0',
  descuento_proveedor: '0',
  impuesto_interno: '0',
  transporte: '',
  margen_ganancia: '',
  iva: '' as IVAOpcion | '',
  descuento_promocion: '0',
  recargo_tarjeta: '',
}

const IVA_OPTIONS = [
  { value: '', label: '— Usar global/categoría —' },
  { value: '0', label: '0% — Exento' },
  { value: '10.5', label: '10.5% — Tasa reducida' },
  { value: '21', label: '21% — Tasa general' },
]

export default function ProductoDrawer({ open, productoId, token, onClose, onSaved }: Props) {
  const [tab, setTab] = useState<'datos' | 'imagenes' | 'costos'>('datos')
  const [form, setForm] = useState<ProductoFormData>(FORM_INICIAL)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [idGuardado, setIdGuardado] = useState<number | null>(null)
  const [imagenes, setImagenes] = useState<ProductoImagen[]>([])
  const [costoForm, setCostoForm] = useState(COSTO_INICIAL)
  const [costoData, setCostoData] = useState<CostoProducto | null>(null)
  const [guardandoCosto, setGuardandoCosto] = useState(false)
  const [costOk, setCostOk] = useState(false)

  useEffect(() => {
    getCategorias().then(setCategorias).catch(() => {})
  }, [])

  useEffect(() => {
    if (!open) {
      setTab('datos')
      setForm(FORM_INICIAL)
      setIdGuardado(null)
      setImagenes([])
      setError(null)
      setCostoForm(COSTO_INICIAL)
      setCostoData(null)
      return
    }
    if (!productoId) return

    setIdGuardado(productoId)
    setCargando(true)
    getProductoAdminDetalle(token, productoId)
      .then((p) => {
        setForm({
          codigo: p.codigo ?? '',
          nombre: p.nombre,
          categoria: p.categoria.id,
          ofrecido: p.ofrecido ?? '',
          marca: p.marca ?? '',
          precio: p.precio,
          precio_oferta: p.precio_oferta ?? '',
          descripcion: p.descripcion ?? '',
          ingredientes: p.ingredientes ?? '',
          modo_uso: p.modo_uso ?? '',
          conservacion: p.conservacion ?? '',
          cont_peso_neto: p.cont_peso_neto ?? '',
          destacado: p.destacado,
          activo: p.activo,
          stock: p.stock,
          descuento: p.descuento,
        })
        setImagenes(p.imagenes)
      })
      .catch(() => setError('Error al cargar el producto'))
      .finally(() => setCargando(false))

    getCostoProducto(token, productoId).then((c) => {
      if (c && c.id) {
        setCostoData(c)
        setCostoForm({
          costo_neto: c.costo_neto,
          descuento_proveedor: c.descuento_proveedor,
          impuesto_interno: c.impuesto_interno,
          transporte: c.transporte ?? '',
          margen_ganancia: c.margen_ganancia ?? '',
          iva: c.iva,
          descuento_promocion: c.descuento_promocion,
          recargo_tarjeta: c.recargo_tarjeta ?? '',
        })
        // Sincronizar precios calculados en el form Datos
        setForm((prev) => ({
          ...prev,
          precio: c.precio_calculado,
          precio_oferta: parseFloat(c.descuento_promocion) > 0 ? c.precio_con_descuento : prev.precio_oferta,
        }))
      }
    }).catch(() => {})
  }, [open, productoId, token])

  function set(field: keyof ProductoFormData, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleGuardar() {
    if (!form.nombre || !form.categoria || !form.precio) {
      setError('Nombre, categoría y precio son requeridos')
      return
    }
    setGuardando(true)
    setError(null)
    try {
      const payload = {
        ...form,
        precio_oferta: form.precio_oferta || null,
        stock: Number(form.stock),
        descuento: Number(form.descuento),
      }
      if (idGuardado) {
        await editarProductoAdmin(token, idGuardado, payload)
      } else {
        const nuevo = await crearProductoAdmin(token, payload)
        setIdGuardado(nuevo.id)
      }
      onSaved()
      if (!productoId) setTab('imagenes')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setGuardando(false)
    }
  }

  async function handleGuardarCosto() {
    const id = idGuardado ?? productoId
    if (!id) return
    setGuardandoCosto(true)
    try {
      const payload = {
        ...costoForm,
        transporte: costoForm.transporte !== '' ? costoForm.transporte : null,
        margen_ganancia: costoForm.margen_ganancia !== '' ? costoForm.margen_ganancia : null,
        recargo_tarjeta: costoForm.recargo_tarjeta !== '' ? costoForm.recargo_tarjeta : null,
      }
      const updated = await saveCostoProducto(token, id, payload)
      setCostoData(updated)
      // Actualizar precios en tab Datos
      setForm((prev) => ({
        ...prev,
        precio: updated.precio_calculado,
        precio_oferta: parseFloat(updated.descuento_promocion) > 0 ? updated.precio_con_descuento : '',
      }))
      setCostOk(true)
      setTimeout(() => setCostOk(false), 3000)
    } catch {
      // keep form
    } finally {
      setGuardandoCosto(false)
    }
  }

  async function refreshImagenes() {
    const id = idGuardado ?? productoId
    if (!id) return
    try {
      const p = await getProductoAdminDetalle(token, id)
      setImagenes(p.imagenes)
    } catch {
      // silencioso
    }
  }

  const idParaImagenes = idGuardado ?? productoId
  const inputCls =
    'w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500'
  const labelCls = 'text-xs font-medium text-stone-500 uppercase tracking-wide mb-1.5 block'

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 shrink-0">
          <h2 className="font-semibold text-stone-800 text-lg">
            {productoId ? form.nombre || 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-100 px-6 shrink-0">
          {([
            { id: 'datos', label: 'Datos' },
            { id: 'imagenes', label: 'Imágenes' },
            { id: 'costos', label: 'Costos' },
          ] as const).map((t) => {
            const bloqueado = t.id !== 'datos' && !idParaImagenes
            return (
              <button
                key={t.id}
                onClick={() => { if (!bloqueado) setTab(t.id) }}
                disabled={bloqueado}
                className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors disabled:opacity-40 ${
                  tab === t.id
                    ? 'border-green-500 text-green-700'
                    : 'border-transparent text-stone-500 hover:text-stone-700'
                }`}
              >
                {t.label}
                {t.id === 'imagenes' && imagenes.length > 0 && (
                  <span className="ml-1.5 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                    {imagenes.length}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {cargando ? (
            <div className="flex items-center justify-center h-full text-stone-400 gap-3">
              <span className="w-6 h-6 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
              Cargando...
            </div>
          ) : tab === 'datos' ? (
            <div className="p-6 space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
              )}

              <div>
                <label className={labelCls}>Nombre *</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => set('nombre', e.target.value)}
                  className={inputCls}
                  placeholder="Nombre del producto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Código</label>
                  <input
                    type="text"
                    value={form.codigo}
                    onChange={(e) => set('codigo', e.target.value)}
                    className={inputCls}
                    placeholder="SKU-001"
                  />
                </div>
                <div>
                  <label className={labelCls}>Marca</label>
                  <input
                    type="text"
                    value={form.marca}
                    onChange={(e) => set('marca', e.target.value)}
                    className={inputCls}
                    placeholder="Marca"
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Categoría *</label>
                <select
                  value={form.categoria}
                  onChange={(e) => set('categoria', Number(e.target.value))}
                  className={`${inputCls} bg-white`}
                >
                  <option value="">Seleccioná una categoría</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Precios */}
              {costoData ? (
                <div className="bg-stone-50 rounded-xl border border-stone-200 p-4 space-y-3">
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Precios calculados desde estructura de costos
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-stone-400 mb-1">
                        Precio final de venta
                        <span className="ml-1 text-stone-300">costo → proveedor → transp. → imp. → margen → IVA</span>
                      </p>
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm font-semibold text-stone-800">
                        <span className="text-stone-400">$</span>
                        {costoData.precio_calculado}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400 mb-1">
                        Precio con descuento al consumidor
                        <span className="ml-1 text-stone-300">precio × (1 − {costoData.margen_efectivo !== undefined ? costoForm.descuento_promocion : '0'}%)</span>
                      </p>
                      {parseFloat(costoForm.descuento_promocion) > 0 ? (
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm font-semibold text-green-700">
                          <span className="text-stone-400">$</span>
                          {costoData.precio_con_descuento}
                          <span className="text-xs font-normal text-green-600 ml-auto">−{costoForm.descuento_promocion}%</span>
                        </div>
                      ) : (
                        <div className="px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-stone-400 italic">
                          Sin descuento activo
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-stone-400">
                    Para cambiar los precios, editá la pestaña{' '}
                    <button onClick={() => setTab('costos')} className="text-green-700 font-medium hover:underline">Costos →</button>
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Precio * <span className="normal-case font-normal text-stone-300">(manual — sin costos)</span></label>
                    <input
                      type="number" min="0" step="0.01"
                      value={form.precio}
                      onChange={(e) => set('precio', e.target.value)}
                      className={inputCls}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Precio oferta</label>
                    <input
                      type="number" min="0" step="0.01"
                      value={form.precio_oferta}
                      onChange={(e) => set('precio_oferta', e.target.value)}
                      className={inputCls}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => set('stock', Number(e.target.value))}
                    className={inputCls}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className={labelCls}>Descuento %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.descuento}
                    onChange={(e) => set('descuento', Number(e.target.value))}
                    className={inputCls}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className={labelCls}>Peso / Contenido</label>
                  <input
                    type="text"
                    value={form.cont_peso_neto}
                    onChange={(e) => set('cont_peso_neto', e.target.value)}
                    className={inputCls}
                    placeholder="250g"
                  />
                </div>
                <div>
                  <label className={labelCls}>Ofrecido por</label>
                  <input
                    type="text"
                    value={form.ofrecido}
                    onChange={(e) => set('ofrecido', e.target.value)}
                    className={inputCls}
                    placeholder="Proveedor"
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => set('descripcion', e.target.value)}
                  rows={3}
                  className={`${inputCls} resize-none`}
                  placeholder="Descripción del producto..."
                />
              </div>

              <div>
                <label className={labelCls}>Ingredientes</label>
                <textarea
                  value={form.ingredientes}
                  onChange={(e) => set('ingredientes', e.target.value)}
                  rows={2}
                  className={`${inputCls} resize-none`}
                  placeholder="Lista de ingredientes..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Modo de uso</label>
                  <textarea
                    value={form.modo_uso}
                    onChange={(e) => set('modo_uso', e.target.value)}
                    rows={2}
                    className={`${inputCls} resize-none`}
                    placeholder="Cómo usar el producto..."
                  />
                </div>
                <div>
                  <label className={labelCls}>Conservación</label>
                  <textarea
                    value={form.conservacion}
                    onChange={(e) => set('conservacion', e.target.value)}
                    rows={2}
                    className={`${inputCls} resize-none`}
                    placeholder="Condiciones de conservación..."
                  />
                </div>
              </div>

              <div className="flex gap-6 pt-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => set('activo', !form.activo)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form.activo ? 'bg-green-500' : 'bg-stone-300'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${form.activo ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                  <span className="text-sm text-stone-700">Activo</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => set('destacado', !form.destacado)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form.destacado ? 'bg-green-500' : 'bg-stone-300'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${form.destacado ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                  <span className="text-sm text-stone-700">Destacado</span>
                </label>
              </div>
            </div>
          ) : tab === 'imagenes' ? (
            <div className="p-6">
              {idParaImagenes ? (
                <ImagenesManager
                  productoId={idParaImagenes}
                  token={token}
                  imagenes={imagenes}
                  onRefresh={refreshImagenes}
                />
              ) : (
                <p className="text-center text-stone-400 text-sm py-8">
                  Guardá el producto primero para agregar imágenes
                </p>
              )}
            </div>
          ) : (
            <div className="p-6 space-y-5">
              {costOk && (
                <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl">Costos guardados correctamente.</div>
              )}
              {costoData && (
                <div className="bg-stone-50 rounded-xl p-4 text-sm space-y-1">
                  <p className="font-semibold text-stone-700 mb-2">Precios calculados</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white rounded-lg p-3 border border-stone-200">
                      <p className="text-xs text-stone-400 mb-1">Precio venta</p>
                      <p className="font-bold text-stone-800">${costoData.precio_calculado}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-stone-200">
                      <p className="text-xs text-stone-400 mb-1">Con tarjeta</p>
                      <p className="font-bold text-stone-800">${costoData.precio_con_tarjeta}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-stone-200">
                      <p className="text-xs text-stone-400 mb-1">Con descuento</p>
                      <p className="font-bold text-stone-800">${costoData.precio_con_descuento}</p>
                    </div>
                  </div>
                  <p className="text-xs text-stone-400 pt-1">
                    Margen efectivo: {costoData.margen_efectivo}% · IVA efectivo: {costoData.iva_efectivo}%
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Costo neto ($)</label>
                  <input type="number" min="0" step="0.01" value={costoForm.costo_neto}
                    onChange={(e) => setCostoForm((p) => ({ ...p, costo_neto: e.target.value }))}
                    className={inputCls} placeholder="0.00" />
                </div>
                <div>
                  <label className={labelCls}>Descuento proveedor (%)</label>
                  <input type="number" min="0" max="100" step="0.01" value={costoForm.descuento_proveedor}
                    onChange={(e) => setCostoForm((p) => ({ ...p, descuento_proveedor: e.target.value }))}
                    className={inputCls} placeholder="0" />
                </div>
                <div>
                  <label className={labelCls}>Impuesto interno (%)</label>
                  <input type="number" min="0" step="0.01" value={costoForm.impuesto_interno}
                    onChange={(e) => setCostoForm((p) => ({ ...p, impuesto_interno: e.target.value }))}
                    className={inputCls} placeholder="0" />
                </div>
                <div>
                  <label className={labelCls}>Transporte ($) — vacío = global</label>
                  <input type="number" min="0" step="0.01" value={costoForm.transporte}
                    onChange={(e) => setCostoForm((p) => ({ ...p, transporte: e.target.value }))}
                    className={inputCls} placeholder="global" />
                </div>
                <div>
                  <label className={labelCls}>Margen ganancia (%) — vacío = cat/global</label>
                  <input type="number" min="0" step="0.01" value={costoForm.margen_ganancia}
                    onChange={(e) => setCostoForm((p) => ({ ...p, margen_ganancia: e.target.value }))}
                    className={inputCls} placeholder="global" />
                </div>
                <div>
                  <label className={labelCls}>IVA específico</label>
                  <select value={costoForm.iva}
                    onChange={(e) => setCostoForm((p) => ({ ...p, iva: e.target.value as IVAOpcion | '' }))}
                    className={`${inputCls} bg-white`}>
                    {IVA_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Descuento promoción consumidor (%)</label>
                  <input type="number" min="0" max="100" step="0.01" value={costoForm.descuento_promocion}
                    onChange={(e) => setCostoForm((p) => ({ ...p, descuento_promocion: e.target.value }))}
                    className={inputCls} placeholder="0" />
                </div>
                <div>
                  <label className={labelCls}>Recargo tarjeta (%) — vacío = global</label>
                  <input type="number" min="0" step="0.01" value={costoForm.recargo_tarjeta}
                    onChange={(e) => setCostoForm((p) => ({ ...p, recargo_tarjeta: e.target.value }))}
                    className={inputCls} placeholder="global" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {(tab === 'datos' || tab === 'costos') && (
          <div className="border-t border-stone-100 px-6 py-4 flex items-center justify-between shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Cancelar
            </button>
            {tab === 'datos' ? (
              <button
                onClick={handleGuardar}
                disabled={guardando}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-stone-900 text-white hover:bg-stone-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {guardando && (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                {guardando ? 'Guardando...' : idGuardado ? 'Actualizar' : 'Crear producto'}
              </button>
            ) : (
              <button
                onClick={handleGuardarCosto}
                disabled={guardandoCosto}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-stone-900 text-white hover:bg-stone-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {guardandoCosto && (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                {guardandoCosto ? 'Guardando...' : 'Guardar costos'}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}
