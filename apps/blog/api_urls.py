from rest_framework.routers import DefaultRouter
from .api_views import BlogCategoriaViewSet, PostViewSet

router = DefaultRouter()
router.register('blog/categorias', BlogCategoriaViewSet, basename='blog-categoria')
router.register('blog/posts', PostViewSet, basename='blog-post')

urlpatterns = router.urls
