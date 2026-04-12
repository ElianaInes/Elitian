from rest_framework.routers import DefaultRouter
from . import api_views

router = DefaultRouter()
router.register('categorias', api_views.CategoriaViewSet, basename='categoria')
router.register('productos', api_views.ProductoViewSet, basename='producto')
router.register('carrito', api_views.CarritoViewSet, basename='carrito')
router.register('ordenes', api_views.OrdenViewSet, basename='orden')

urlpatterns = router.urls
