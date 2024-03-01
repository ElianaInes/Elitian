from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import login_view, logout_view, register_view, password_reset_view
from .views import tienda, tienda_categoria, tienda_producto

urlpatterns = [
    #path('login/', login_view, name='login'),
    #path('register/', register_view, name='register'),
    #path('logout/', logout_view, name='logout'),
    #path('password_reset', password_reset_view, name='password_reset'),
    path('tienda/', tienda, name='tienda'),
    path('tienda/categorias/', tienda, name='tienda'),
    path('tienda/categorias/<slug:slug>', tienda_categoria, name='tienda_categoria'),
    path('tienda/categorias/<slug:categoria_slug>/<slug:producto_slug>', tienda_producto, name='tienda_producto'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)