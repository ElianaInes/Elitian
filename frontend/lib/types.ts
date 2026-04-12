export interface Categoria {
  id: number
  nombre: string
  slug: string
  descripcion: string
  imagen: string | null
  orden: number
}

export interface ProductoImagen {
  id: number
  imagen: string
  principal: boolean
  orden: number
}

export interface ProductoList {
  id: number
  codigo: string
  nombre: string
  slug: string
  marca: string
  categoria: number
  categoria_nombre: string
  precio: string
  precio_oferta: string | null
  descuento: number
  precio_final: string
  tiene_oferta: boolean
  stock: number
  destacado: boolean
  imagen_principal: string | null
}

export interface ProductoDetail extends Omit<ProductoList, 'categoria'> {
  categoria: Categoria
  ofrecido: string
  descripcion: string
  ingredientes: string
  modo_uso: string
  conservacion: string
  cont_peso_neto: string
  imagenes: ProductoImagen[]
  calificacion_promedio: number | null
  total_resenas: number
  creado: string
  actualizado: string
}

export interface Resena {
  id: number
  usuario_nombre: string
  comentario: string
  calificacion: number
  creado: string
}

export interface ItemCarrito {
  id: number
  producto: ProductoList
  cantidad: number
  subtotal: string
}

export interface Carrito {
  id: number
  items: ItemCarrito[]
  total: string
  cantidad_items: number
  actualizado: string
}

export interface ItemOrden {
  id: number
  producto_nombre: string
  cantidad: number
  precio_unitario: string
  subtotal: string
}

export interface Orden {
  id: number
  estado: string
  estado_display: string
  total: string
  notas: string
  items: ItemOrden[]
  creado: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
