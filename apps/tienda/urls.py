from django.urls import path
from . import views

urlpatterns = [
    path('tienda/', views.tienda, name='tienda'),
    path('tienda/<slug:slug>/', views.tienda_categoria, name='tienda_categoria'),
    path(
        'tienda/<slug:categoria_slug>/<slug:producto_slug>/',
        views.tienda_producto,
        name='tienda_producto',
    ),
]
