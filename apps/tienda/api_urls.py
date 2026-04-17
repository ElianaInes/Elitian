from django.urls import path
from rest_framework.routers import DefaultRouter
from . import api_views, admin_views

router = DefaultRouter()
router.register('categorias', api_views.CategoriaViewSet, basename='categoria')
router.register('productos', api_views.ProductoViewSet, basename='producto')
router.register('carrito', api_views.CarritoViewSet, basename='carrito')
router.register('ordenes', api_views.OrdenViewSet, basename='orden')

urlpatterns = router.urls + [
    path('mp/webhook/', api_views.mp_webhook, name='mp-webhook'),
    path('admin/stats/', admin_views.stats, name='admin-stats'),
    path('admin/ordenes/', admin_views.ordenes_admin, name='admin-ordenes'),
    path('admin/ordenes/<int:pk>/estado/', admin_views.orden_estado, name='admin-orden-estado'),
    path('admin/productos/', admin_views.productos_admin, name='admin-productos'),
    path('admin/productos/<int:pk>/toggle/', admin_views.producto_toggle, name='admin-producto-toggle'),
]
