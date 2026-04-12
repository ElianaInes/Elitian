import type {
  Categoria,
  ProductoList,
  ProductoDetail,
  Resena,
  Carrito,
  Orden,
  PaginatedResponse,
} from './types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(error.detail ?? 'Error en la API')
  }

  if (res.status === 204) return null as T
  return res.json()
}

// ─── Categorías ───────────────────────────────────────────────────────────────

export async function getCategorias(): Promise<Categoria[]> {
  const data = await apiFetch<PaginatedResponse<Categoria>>('/categorias/')
  return data.results
}

export async function getCategoria(slug: string): Promise<Categoria> {
  return apiFetch<Categoria>(`/categorias/${slug}/`)
}

// ─── Productos ────────────────────────────────────────────────────────────────

export interface ProductosFiltros {
  categoria?: string
  search?: string
  ordering?: string
  page?: number
  destacado?: boolean
  con_stock?: boolean
  precio_min?: number
  precio_max?: number
}

export async function getProductos(
  filtros: ProductosFiltros = {},
): Promise<PaginatedResponse<ProductoList>> {
  const params = new URLSearchParams()
  if (filtros.categoria) params.set('categoria', filtros.categoria)
  if (filtros.search) params.set('search', filtros.search)
  if (filtros.ordering) params.set('ordering', filtros.ordering)
  if (filtros.page) params.set('page', String(filtros.page))
  if (filtros.destacado) params.set('destacado', 'true')
  if (filtros.con_stock) params.set('con_stock', 'true')
  if (filtros.precio_min) params.set('precio_min', String(filtros.precio_min))
  if (filtros.precio_max) params.set('precio_max', String(filtros.precio_max))

  const query = params.toString()
  return apiFetch<PaginatedResponse<ProductoList>>(`/productos/${query ? `?${query}` : ''}`)
}

export async function getProducto(slug: string): Promise<ProductoDetail> {
  return apiFetch<ProductoDetail>(`/productos/${slug}/`)
}

export async function getProductosRelacionados(slug: string): Promise<ProductoList[]> {
  return apiFetch<ProductoList[]>(`/productos/${slug}/relacionados/`)
}

export async function getResenas(slug: string): Promise<Resena[]> {
  return apiFetch<Resena[]>(`/productos/${slug}/resenas/`)
}

// ─── Carrito ──────────────────────────────────────────────────────────────────

export async function getCarrito(token: string): Promise<Carrito> {
  return apiFetch<Carrito>('/carrito/', {}, token)
}

export async function agregarAlCarrito(
  productoId: number,
  cantidad: number,
  token: string,
): Promise<Carrito> {
  return apiFetch<Carrito>(
    '/carrito/agregar/',
    { method: 'POST', body: JSON.stringify({ producto_id: productoId, cantidad }) },
    token,
  )
}

export async function actualizarCarrito(
  itemId: number,
  cantidad: number,
  token: string,
): Promise<Carrito> {
  return apiFetch<Carrito>(
    '/carrito/actualizar/',
    { method: 'PATCH', body: JSON.stringify({ item_id: itemId, cantidad }) },
    token,
  )
}

export async function eliminarDelCarrito(itemId: number, token: string): Promise<Carrito> {
  return apiFetch<Carrito>(
    '/carrito/eliminar/',
    { method: 'DELETE', body: JSON.stringify({ item_id: itemId }) },
    token,
  )
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  access: string
  refresh: string
  user?: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
  }
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  return apiFetch('/auth/token/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export async function registro(data: {
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
}): Promise<AuthResponse> {
  return apiFetch('/auth/registro/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function refreshToken(refresh: string): Promise<{ access: string }> {
  return apiFetch('/auth/token/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh }),
  })
}

export async function getMe(token: string): Promise<AuthResponse['user']> {
  return apiFetch('/auth/me/', {}, token)
}

// ─── Órdenes ─────────────────────────────────────────────────────────────────

export async function crearOrden(token: string, notas?: string): Promise<Orden> {
  return apiFetch<Orden>(
    '/ordenes/crear/',
    { method: 'POST', body: JSON.stringify({ notas: notas ?? '' }) },
    token,
  )
}

export async function getOrdenes(token: string): Promise<Orden[]> {
  const data = await apiFetch<PaginatedResponse<Orden>>('/ordenes/', {}, token)
  return data.results
}

export async function getOrden(id: number, token: string): Promise<Orden> {
  return apiFetch<Orden>(`/ordenes/${id}/`, {}, token)
}
