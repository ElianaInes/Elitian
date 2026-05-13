'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { subirImagenProducto, eliminarImagenProducto, setImagenPrincipal } from '@/lib/api'
import type { ProductoImagen } from '@/lib/types'

interface Props {
  productoId: number
  token: string
  imagenes: ProductoImagen[]
  onRefresh: () => void
}

export default function ImagenesManager({ productoId, token, imagenes, onRefresh }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [settingId, setSettingId] = useState<number | null>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await subirImagenProducto(token, productoId, file)
      onRefresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al subir imagen')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleDelete(imgId: number) {
    if (!confirm('¿Eliminar esta imagen?')) return
    setDeletingId(imgId)
    try {
      await eliminarImagenProducto(token, imgId)
      onRefresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar imagen')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleSetPrincipal(imgId: number) {
    setSettingId(imgId)
    try {
      await setImagenPrincipal(token, imgId)
      onRefresh()
    } finally {
      setSettingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-stone-200 rounded-xl py-6 text-sm text-stone-500 hover:border-green-500 hover:text-green-600 transition-colors disabled:opacity-50"
      >
        {uploading ? (
          <>
            <span className="w-4 h-4 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
            Subiendo...
          </>
        ) : (
          <>
            <span className="text-xl leading-none">+</span>
            Agregar imagen
          </>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />

      {imagenes.length === 0 ? (
        <p className="text-center text-stone-400 text-sm py-8">Sin imágenes todavía</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {imagenes.map((img) => (
            <div
              key={img.id}
              className={`relative rounded-xl overflow-hidden bg-stone-100 aspect-square group border-2 ${
                img.principal ? 'border-green-500' : 'border-transparent'
              }`}
            >
              <Image src={img.imagen} alt="" fill className="object-cover" />
              {img.principal && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  Principal
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2 gap-2">
                {!img.principal && (
                  <button
                    onClick={() => handleSetPrincipal(img.id)}
                    disabled={settingId === img.id}
                    className="text-xs bg-white/90 text-stone-800 px-2 py-1 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                  >
                    {settingId === img.id ? '...' : 'Principal'}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(img.id)}
                  disabled={deletingId === img.id}
                  className="ml-auto text-xs bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deletingId === img.id ? '...' : 'Eliminar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
