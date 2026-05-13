# Elitian Web

Plataforma de e-commerce fullstack para productos naturales y sostenibles. Elitian conecta emprendedores que fabrican productos ecoconscientes con consumidores comprometidos con el cuidado personal y el planeta. Incluye tienda online, blog temático y pagos integrados con **MercadoPago**.

Construida con **Django REST Framework** en el backend y **Next.js** en el frontend.

---

## Tecnologías

### Backend
| Tecnología | Versión |
|---|---|
| Python / Django | 5.1.7 |
| Django REST Framework | 3.15.2 |
| SimpleJWT | 5.3.1 |
| MercadoPago SDK | 2.3.0 |
| PostgreSQL | — |
| Pillow | 10.4.0 |
| CKEditor | 6.7.1 |

### Frontend
| Tecnología | Versión |
|---|---|
| Next.js | 16.2.3 |
| React | 19.2.4 |
| TypeScript | 5 |
| Tailwind CSS | 4 |
| Zustand | 5.0.12 |

---

## Estructura del proyecto

```
ElitianWeb/
├── Elitian/              # Configuración Django (settings, urls, wsgi)
├── apps/
│   ├── tienda/           # App e-commerce (modelos, API, admin views, emails)
│   └── blog/             # App blog (posts, categorías, suscriptores)
├── frontend/             # Aplicación Next.js
│   ├── app/              # Rutas y páginas (App Router)
│   │   ├── admin/        # Panel de administración (staff only)
│   │   │   ├── blog/     # CRUD completo de posts del blog
│   │   │   ├── ordenes/  # Gestión de pedidos
│   │   │   └── productos/# CRUD completo de productos + imágenes
│   │   ├── blog/         # Blog público
│   │   ├── checkout/     # Flujo de compra + retorno MP
│   │   ├── cuenta/       # Autenticación y perfil
│   │   └── tienda/       # Catálogo y detalle de productos
│   ├── components/       # Navbar, Footer, HeroCarousel
│   ├── lib/              # Cliente API (api.ts) y tipos TypeScript (types.ts)
│   └── store/            # Estado global con Zustand (auth, carrito)
├── media/                # Archivos subidos (imágenes de productos y blog)
├── static/               # Assets estáticos
├── logs/                 # Logs rotativos de la aplicación
├── manage.py
├── Dockerfile            # Backend (gunicorn)
├── docker-compose.yml    # Orquestación completa
└── .env                  # Variables de entorno backend
```

---

## Funcionalidades

### Tienda
- Catálogo de productos con filtros por categoría, precio y stock
- Buscador de productos
- Detalle de producto con galería de imágenes y productos relacionados
- Sistema de reseñas con moderación
- Carrito de compras persistente por usuario autenticado
- Descuento automático del **20%** para pagos por transferencia bancaria o efectivo

### Checkout y Pagos
- Tres métodos de pago: transferencia bancaria, efectivo y MercadoPago
- Integración completa con **MercadoPago Checkout Pro**: creación de preferencia, redirección al checkout de MP y confirmación automática por webhook con validación HMAC-SHA256
- Páginas de retorno según estado del pago (aprobado, pendiente, rechazado)
- Campos de dirección de envío en el checkout (teléfono, dirección, ciudad, provincia, código postal)

### Blog
- Posts con editor de contenido HTML
- Categorías y buscador
- Página de detalle con posts relacionados

### Autenticación
- Registro y login con JWT (access + refresh token)
- Perfil de usuario editable
- Historial y detalle de pedidos
- Cambio de contraseña

### Panel de Administración (Next.js — solo staff)
- Acceso exclusivo desde el navbar para usuarios `is_staff`
- **Dashboard** con estadísticas de ventas, pedidos y productos
- **Gestión de órdenes**: listar, filtrar por estado, cambiar estado con notificación por email automática
- **Gestión de productos** con CRUD completo:
  - Crear producto con todos sus campos (precio, stock, oferta, descripción, ingredientes, modo de uso, etc.)
  - Editar producto via drawer lateral con 3 pestañas: Datos, Imágenes y Costos
  - Subir, eliminar y establecer imagen principal por producto
  - Activar / desactivar productos
  - Badges de stock (sin stock / stock bajo / normal)
  - Precio y precio oferta de solo lectura cuando hay estructura de costos cargada
- **Estructura de costos** (`/admin/costos`):
  - **Global**: margen de ganancia, IVA (0% / 10.5% / 21%), recargo tarjeta de crédito y transporte fijo por defecto
  - **Por categoría**: margen e IVA específico por categoría que sobrescribe el global
  - **Por producto** (pestaña Costos en cada producto): costo neto, descuento proveedor, impuesto interno, transporte, margen, IVA, descuento promoción al consumidor y recargo tarjeta — todos con herencia jerárquica (producto → categoría → global)
  - **Fórmula**: `costo_neto → −descuento_proveedor → +transporte → +impuesto_interno → +margen → +IVA = precio de venta → −descuento_promoción = precio con descuento`
  - Al guardar la estructura de costos, el precio del producto se actualiza automáticamente
  - **Promociones bancarias**: descuentos % o cuotas sin interés por banco, con vigencia configurable
- **Gestión del blog** con CRUD completo:
  - Crear y editar posts con imagen de portada, categoría y etiqueta
  - Editor de contenido HTML con vista previa en tiempo real
  - Eliminar posts
  - Búsqueda por título

### Notificaciones y Emails
- Email de confirmación al crear una orden (transferencia/efectivo)
- Email automático al cambiar el estado de una orden (confirmado, enviado, entregado, cancelado)

### SEO y Performance
- `generateMetadata` dinámico en páginas de producto y posts del blog
- Sitemap XML dinámico (`/sitemap.xml`)
- `robots.txt` configurado
- PWA manifest

### Seguridad y Operaciones
- Rate limiting: 60 req/min anónimos, 300 req/min autenticados
- Logging con rotación de archivos (5 MB, 3 backups) en `/logs/`
- Docker: Dockerfile backend + Dockerfile frontend + docker-compose con PostgreSQL y healthchecks

---

## Instalación

### Requisitos previos
- Python 3.11+
- Node.js 18+
- PostgreSQL

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd ElitianWeb
```

### 2. Backend — Django

```bash
# Crear y activar entorno virtual
python -m venv entornos/.venv_elitian

# Windows (bash)
source entornos/.venv_elitian/Scripts/activate
# Linux / Mac
# source entornos/.venv_elitian/bin/activate

# Instalar dependencias
pip install -r utils/requirements.txt
```

Crear la base de datos en PostgreSQL:

```sql
CREATE DATABASE elitiandb;
```

Configurar variables de entorno (ver sección más abajo), luego:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic
python manage.py runserver
```

El backend queda disponible en `http://localhost:8000`.

### 3. Frontend — Next.js

```bash
cd frontend
npm install
npm run dev
```

El frontend queda disponible en `http://localhost:3000`.

---

## Variables de entorno

### Backend — `.env`

```env
SECRET_KEY=tu-secret-key-django
DEBUG=True

# PostgreSQL
DB_NAME=elitiandb
DB_USER=postgres
DB_PASSWORD=tu-password
DB_HOST=localhost
DB_PORT=5432

# MercadoPago
MP_ACCESS_TOKEN=APP_USR-tu-access-token
MP_WEBHOOK_SECRET=tu-webhook-secret
SITE_URL=http://localhost:3000

# Email (opcional en desarrollo — usa consola por defecto)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=tu@email.com
EMAIL_HOST_PASSWORD=tu-app-password
DEFAULT_FROM_EMAIL=Elitian <tu@email.com>
```

> En producción: `DEBUG=False`, `SITE_URL=https://tu-dominio.com` y Access Token productivo de MP.

### Frontend — `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_MEDIA_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## API REST

Base URL: `/api/v1/`

### Autenticación

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/auth/token/` | Login → access + refresh token |
| POST | `/auth/token/refresh/` | Renovar access token |
| POST | `/auth/registro/` | Registro de nuevo usuario |
| GET / PATCH | `/auth/me/` | Perfil del usuario autenticado |
| POST | `/auth/cambiar-password/` | Cambiar contraseña |

### Tienda

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/categorias/` | Listar categorías activas |
| GET | `/productos/` | Listar productos con filtros |
| GET | `/productos/{slug}/` | Detalle de producto |
| GET | `/productos/{slug}/relacionados/` | Productos de la misma categoría |
| GET | `/productos/{slug}/resenas/` | Reseñas aprobadas |
| POST | `/productos/{slug}/agregar_resena/` | Publicar reseña (requiere auth) |
| GET | `/carrito/` | Ver carrito del usuario |
| POST | `/carrito/agregar/` | Agregar producto al carrito |
| PATCH | `/carrito/actualizar/` | Actualizar cantidad de un ítem |
| DELETE | `/carrito/eliminar/` | Eliminar ítem del carrito |
| DELETE | `/carrito/vaciar/` | Vaciar el carrito |
| POST | `/ordenes/crear/` | Crear orden desde el carrito |
| GET | `/ordenes/` | Historial de órdenes del usuario |
| GET | `/ordenes/{id}/` | Detalle de una orden |
| POST | `/ordenes/{id}/crear_preferencia_mp/` | Crear preferencia MercadoPago |
| POST | `/mp/webhook/` | Webhook de notificaciones MP |

### Blog

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/blog/categorias/` | Listar categorías del blog |
| GET | `/blog/posts/` | Listar posts (filtros: `categoria`, `search`) |
| GET | `/blog/posts/{slug}/` | Detalle de post |

### Admin — Productos (requiere `is_staff`)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/admin/stats/` | Estadísticas generales |
| GET | `/admin/ordenes/` | Listar todas las órdenes |
| PATCH | `/admin/ordenes/{id}/estado/` | Cambiar estado de una orden |
| GET | `/admin/productos/` | Listar todos los productos |
| POST | `/admin/productos/crear/` | Crear producto |
| GET / PATCH | `/admin/productos/{id}/editar/` | Ver o editar producto |
| PATCH | `/admin/productos/{id}/toggle/` | Activar / desactivar producto |
| POST | `/admin/productos/{id}/imagenes/` | Subir imagen al producto |
| DELETE | `/admin/imagenes/{id}/eliminar/` | Eliminar imagen |
| PATCH | `/admin/imagenes/{id}/principal/` | Establecer imagen principal |

### Admin — Blog (requiere `is_staff`)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/admin/blog/posts/` | Listar todos los posts |
| POST | `/admin/blog/posts/crear/` | Crear post (multipart) |
| GET / PATCH | `/admin/blog/posts/{id}/editar/` | Ver o editar post |
| DELETE | `/admin/blog/posts/{id}/eliminar/` | Eliminar post |
| GET | `/admin/blog/categorias/` | Listar categorías del blog |

### Admin — Costos (requiere `is_staff`)

| Método | Endpoint | Descripción |
|---|---|---|
| GET / PATCH | `/admin/costos/global/` | Ver o editar configuración global (margen, IVA, tarjeta, transporte) |
| GET | `/admin/costos/categorias/` | Listar categorías con su config de costo |
| POST / PATCH / DELETE | `/admin/costos/categorias/{id}/` | Crear, editar o quitar config de costo para una categoría |
| GET / POST / PATCH | `/admin/costos/productos/{id}/` | Ver o editar estructura de costos de un producto |
| GET / POST | `/admin/costos/bancos/` | Listar o crear promoción bancaria |
| PATCH / DELETE | `/admin/costos/bancos/{id}/` | Editar o eliminar promoción bancaria |

---

## Flujo de pago con MercadoPago

```
1. Usuario elige "Pago online con MercadoPago" en el checkout
2. Se crea la Orden en Django con estado "pendiente"
3. Django genera una Preferencia en la API de MercadoPago
4. El frontend redirige al usuario al Checkout Pro de MP
5. El usuario completa el pago en la plataforma de MP
6. MP redirige de vuelta a /checkout/mp-retorno con el estado del pago
7. MP envía un webhook a /api/v1/mp/webhook/ → la Orden se actualiza a "confirmado"
8. Se envía email de confirmación al usuario
```

---

## Modelos de datos

```
Categorias ──< Productos ──< ProductoImagen
    │               │
    │               └──< Resena (usuario, calificacion, aprobado)
    │               │
    │               └── CostoProducto
    │                     ├── costo_neto, descuento_proveedor, impuesto_interno
    │                     ├── transporte, margen_ganancia, iva (todos opcionales → heredan)
    │                     ├── descuento_promocion, recargo_tarjeta
    │                     └── @property: precio_calculado, precio_con_tarjeta, precio_con_descuento
    │
    └── ConfiguracionCategoriaCosto (margen_ganancia, iva)

ConfiguracionGlobal [singleton pk=1]
 ├── margen_ganancia, iva, recargo_tarjeta, transporte
 └── Herencia: CostoProducto → ConfiguracionCategoriaCosto → ConfiguracionGlobal

PromocionBanco (nombre, banco, tipo: descuento|cuotas, valor, activo, vigencia)

Carrito (usuario) ──< ItemCarrito (producto, cantidad)

Orden (usuario)
 ├── estado: pendiente | confirmado | enviado | entregado | cancelado
 ├── metodo_pago: transferencia | efectivo | tarjeta
 ├── total, descuento_aplicado
 ├── telefono, direccion, ciudad, provincia, codigo_postal
 ├── mp_preference_id, mp_payment_id, mp_estado_pago
 └── items → ItemOrden (producto, cantidad, precio_unitario)

BlogCategoria ──< BlogPost (autor, titulo, contenido HTML, imagen_post, slug, etiqueta)

Suscriptor (email)
```

---

## Rutas del frontend

| Ruta | Descripción |
|---|---|
| `/` | Home con productos destacados y categorías |
| `/tienda` | Catálogo con filtros |
| `/tienda/[categoria]/[producto]` | Detalle de producto |
| `/blog` | Listado de posts |
| `/blog/[slug]` | Post individual |
| `/checkout` | Finalizar compra |
| `/checkout/mp-retorno` | Retorno desde MercadoPago |
| `/cuenta/login` | Inicio de sesión |
| `/cuenta/registro` | Registro de usuario |
| `/cuenta/perfil` | Editar perfil |
| `/cuenta/ordenes` | Historial de pedidos |
| `/cuenta/ordenes/[id]` | Detalle de pedido |
| `/admin` | Dashboard (solo staff) |
| `/admin/productos` | CRUD de productos + imágenes + costos |
| `/admin/ordenes` | Gestión de pedidos |
| `/admin/blog` | CRUD del blog |
| `/admin/costos` | Estructura de costos global, por categoría y promociones bancarias |
| `/conocenos` | Página institucional |
| `/recicla` | Información sobre reciclaje |
| `/contacto` | Contacto |

---

## Licencia

Proyecto privado — todos los derechos reservados © Elitian.
