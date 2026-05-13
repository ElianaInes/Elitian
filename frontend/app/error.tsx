'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl mb-4">⚠️</p>
      <h1 className="text-2xl font-bold text-stone-800 mb-2">Algo salió mal</h1>
      <p className="text-stone-500 mb-8 max-w-sm">
        Ocurrió un error inesperado. Podés intentarlo de nuevo.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors text-sm"
      >
        Intentar de nuevo
      </button>
    </div>
  )
}
