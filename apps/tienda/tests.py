from decimal import Decimal
from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

from .models import Categorias, Productos, Carrito, ItemCarrito, Orden


def crear_usuario(username='testuser', password='testpass123'):
    return User.objects.create_user(
        username=username, password=password, email=f'{username}@test.com'
    )


def crear_categoria():
    return Categorias.objects.create(nombre='Skincare', slug='skincare')


def crear_producto(categoria, precio=1000, stock=10):
    return Productos.objects.create(
        codigo='SKU001', nombre='Jabón Natural', slug='jabon-natural',
        categoria=categoria, marca='EcoMarca', precio=Decimal(str(precio)), stock=stock,
    )


DATOS_ENVIO = {
    'telefono': '3624000000', 'direccion': 'San Martín 123',
    'ciudad': 'Resistencia', 'provincia': 'Chaco',
}


class CarritoAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = crear_usuario()
        self.client.force_authenticate(user=self.user)
        self.producto = crear_producto(crear_categoria())

    def test_carrito_vacio_al_inicio(self):
        res = self.client.get('/api/v1/carrito/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['cantidad_items'], 0)

    def test_agregar_producto(self):
        res = self.client.post('/api/v1/carrito/agregar/', {
            'producto_id': self.producto.pk, 'cantidad': 2,
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['cantidad_items'], 2)

    def test_agregar_sin_stock_falla(self):
        res = self.client.post('/api/v1/carrito/agregar/', {
            'producto_id': self.producto.pk, 'cantidad': 99,
        })
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)


class OrdenAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = crear_usuario()
        self.client.force_authenticate(user=self.user)
        self.producto = crear_producto(crear_categoria())
        carrito, _ = Carrito.objects.get_or_create(usuario=self.user)
        ItemCarrito.objects.create(carrito=carrito, producto=self.producto, cantidad=1)

    def test_crear_orden_transferencia_aplica_descuento(self):
        res = self.client.post('/api/v1/ordenes/crear/', {
            'metodo_pago': 'transferencia', **DATOS_ENVIO,
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        orden = Orden.objects.get(pk=res.data['id'])
        self.assertGreater(orden.descuento_aplicado, 0)
        self.assertEqual(orden.estado, 'pendiente')

    def test_crear_orden_vacia_falla(self):
        Carrito.objects.filter(usuario=self.user).first().items.all().delete()
        res = self.client.post('/api/v1/ordenes/crear/', {'metodo_pago': 'efectivo'})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_descontar_stock_al_crear_orden(self):
        stock_antes = self.producto.stock
        self.client.post('/api/v1/ordenes/crear/', {'metodo_pago': 'efectivo', **DATOS_ENVIO})
        self.producto.refresh_from_db()
        self.assertEqual(self.producto.stock, stock_antes - 1)

    def test_lista_ordenes_solo_propias(self):
        otro = crear_usuario('otro', 'pass123')
        Orden.objects.create(
            usuario=otro, metodo_pago='efectivo',
            total=Decimal('500'), descuento_aplicado=Decimal('0'),
        )
        self.client.post('/api/v1/ordenes/crear/', {'metodo_pago': 'efectivo', **DATOS_ENVIO})
        res = self.client.get('/api/v1/ordenes/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        ids = [o['usuario'] for o in res.data['results']]
        self.assertTrue(all(uid == self.user.pk for uid in ids))


class ProductoAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.producto = crear_producto(crear_categoria())

    def test_listar_productos(self):
        res = self.client.get('/api/v1/productos/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(res.data['count'], 1)

    def test_detalle_producto(self):
        res = self.client.get(f'/api/v1/productos/{self.producto.slug}/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['nombre'], self.producto.nombre)

    def test_producto_inexistente_404(self):
        res = self.client.get('/api/v1/productos/no-existe/')
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)
