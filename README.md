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
│   ├── tienda/           # App e-commerce (modelos, API, admin views)
│   └── blog/             # App blog (posts, categorías, suscriptores)
├── frontend/             # Aplicación Next.js
│   ├── app/              # Rutas y páginas (App Router)
│   ├── components/       # Componentes reutilizables
│   ├── lib/              # Cliente API y tipos TypeScript
│   └── store/            # Estado global con Zustand
├── media/                # Archivos subidos (imágenes)
├── static/               # Assets estáticos
├── manage.py
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
- Integración completa con **MercadoPago Checkout Pro**: creación de preferencia, redirección al checkout de MP y confirmación automática por webhook
- Páginas de retorno según estado del pago (aprobado, pendiente, rechazado)

### Blog
- Posts con editor enriquecido (CKEditor)
- Categorías y buscador de contenido
- Sistema de suscripción por email

### Autenticación
- Registro y login con JWT (access + refresh token)
- Perfil de usuario editable
- Historial y detalle de pedidos

### Panel de Administración (Next.js)
- Estadísticas de ventas y pedidos
- Gestión de órdenes con cambio de estado
- Gestión de productos (activar/desactivar, buscar)

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

# Windows
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
SITE_URL=http://localhost:3000
```

> En producción: `DEBUG=False`, `SITE_URL=https://tu-dominio.com` y Access Token productivo de MP.

### Frontend — `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_MEDIA_URL=http://localhost:8000
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

### Admin (requiere `is_staff`)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/admin/stats/` | Estadísticas generales |
| GET | `/admin/ordenes/` | Listar todas las órdenes |
| PATCH | `/admin/ordenes/{id}/estado/` | Cambiar estado de una orden |
| GET | `/admin/productos/` | Listar todos los productos |
| PATCH | `/admin/productos/{id}/toggle/` | Activar / desactivar producto |

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
```

---

## Modelos de datos

```
Categorias ──< Productos ──< ProductoImagen
                    │
                    └──< Resena (usuario, calificacion, aprobado)

Carrito (usuario) ──< ItemCarrito (producto, cantidad)

Orden (usuario)
 ├── estado: pendiente | confirmado | enviado | entregado | cancelado
 ├── metodo_pago: transferencia | efectivo | tarjeta
 ├── total, descuento_aplicado
 ├── mp_preference_id, mp_payment_id, mp_estado_pago
 └── items → ItemOrden (producto, cantidad, precio_unitario)

BlogCategoria ──< BlogPost ──< Suscriptor
```

---

## Rutas del frontend

| Ruta | Descripción |
|---|---|
| `/` | Home con productos destacados |
| `/tienda` | Catálogo con filtros |
| `/tienda/[categoria]/[producto]` | Detalle de producto |
| `/blog` | Listado de posts |
| `/blog/[slug]` | Post individual |
| `/checkout` | Finalizar compra |
| `/checkout/exito` | Confirmación para transferencia / efectivo |
| `/checkout/mp-retorno` | Retorno desde MercadoPago |
| `/cuenta/login` | Inicio de sesión |
| `/cuenta/registro` | Registro de usuario |
| `/cuenta/perfil` | Editar perfil |
| `/cuenta/ordenes` | Historial de pedidos |
| `/cuenta/ordenes/[id]` | Detalle de pedido |
| `/admin` | Panel de administración |
| `/admin/productos` | Gestión de productos |
| `/admin/ordenes` | Gestión de órdenes |
| `/conocenos` | Página institucional |
| `/recicla` | Información sobre reciclaje |
| `/contacto` | Contacto |

---

## Licencia

Proyecto privado — todos los derechos reservados © Elitian.
