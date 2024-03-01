from django.contrib import admin
from .models import Categorias, Productos, Resena, Estadistica
from .models import Carrito, ItemCarrito

@admin.register(Categorias)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'activo']
    prepopulated_fields = {'slug': ('nombre',)}

@admin.register(Productos)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'codigo', 'categoria', 'precio', 'precio_oferta', 'ofrecido', 'marca', 'descripcion', 'ingredientes', 'modo_uso', 'conservacion', 'cont_peso_neto', 'destacado', 'activo', 'imagen', 'imagen2', 'imagen3']
    list_filter = ['categoria', 'activo']
    search_fields = ['nombre', 'codigo']
    prepopulated_fields = {'slug': ('nombre',)}

@admin.register(Carrito)
class CarritoAdmin(admin.ModelAdmin):
    list_display = ['usuario']

@admin.register(ItemCarrito)
class ItemCarritoAdmin(admin.ModelAdmin):
    list_display = ['producto', 'carrito', 'cantidad']

@admin.register(Resena)
class ResenaAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'producto', 'calificacion', ]
    search_fields = ['usuario__username', 'producto__nombre']

@admin.register(Estadistica)
class EstadisticaAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'producto', 'cantidad_vendida', 'total_ventas']
    search_fields = ['usuario__username', 'producto__nombre']
