from django.contrib import admin
from .models import (
    Categorias, Productos, ProductoImagen,
    Resena, Carrito, ItemCarrito, Orden, ItemOrden,
)


class ProductoImagenInline(admin.TabularInline):
    model = ProductoImagen
    extra = 1
    fields = ['imagen', 'principal', 'orden']


class ItemOrdenInline(admin.TabularInline):
    model = ItemOrden
    extra = 0
    readonly_fields = ['producto', 'cantidad', 'precio_unitario', 'subtotal']

    def subtotal(self, obj):
        return f'${obj.subtotal}'
    subtotal.short_description = 'Subtotal'


class ItemCarritoInline(admin.TabularInline):
    model = ItemCarrito
    extra = 0
    readonly_fields = ['subtotal']

    def subtotal(self, obj):
        return f'${obj.subtotal}'
    subtotal.short_description = 'Subtotal'


@admin.register(Categorias)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'activo', 'orden']
    list_editable = ['activo', 'orden']
    prepopulated_fields = {'slug': ('nombre',)}
    search_fields = ['nombre']


@admin.register(Productos)
class ProductoAdmin(admin.ModelAdmin):
    list_display = [
        'nombre', 'codigo', 'categoria', 'marca',
        'precio', 'precio_final', 'stock', 'activo', 'destacado',
    ]
    list_filter = ['categoria', 'activo', 'destacado', 'marca']
    list_editable = ['activo', 'destacado', 'stock']
    search_fields = ['nombre', 'codigo', 'marca']
    prepopulated_fields = {'slug': ('nombre',)}
    readonly_fields = ['precio_final', 'creado', 'actualizado']
    inlines = [ProductoImagenInline]
    fieldsets = [
        ('Identificación', {
            'fields': ['codigo', 'nombre', 'slug', 'categoria', 'marca', 'ofrecido'],
        }),
        ('Precios y stock', {
            'fields': ['precio', 'precio_oferta', 'descuento', 'precio_final', 'stock'],
        }),
        ('Descripción', {
            'fields': ['descripcion', 'ingredientes', 'modo_uso', 'conservacion', 'cont_peso_neto'],
            'classes': ['collapse'],
        }),
        ('Visibilidad', {
            'fields': ['activo', 'destacado'],
        }),
        ('Auditoría', {
            'fields': ['creado', 'actualizado'],
            'classes': ['collapse'],
        }),
    ]

    def precio_final(self, obj):
        return f'${obj.precio_final}'
    precio_final.short_description = 'Precio final'


@admin.register(Resena)
class ResenaAdmin(admin.ModelAdmin):
    list_display = ['producto', 'usuario', 'calificacion', 'aprobado', 'creado']
    list_editable = ['aprobado']
    list_filter = ['aprobado', 'calificacion']
    search_fields = ['producto__nombre', 'usuario__username']
    readonly_fields = ['creado']


@admin.register(Carrito)
class CarritoAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'cantidad_items', 'total', 'actualizado']
    readonly_fields = ['creado', 'actualizado', 'total', 'cantidad_items']
    inlines = [ItemCarritoInline]

    def cantidad_items(self, obj):
        return obj.cantidad_items
    cantidad_items.short_description = 'Ítems'

    def total(self, obj):
        return f'${obj.total}'
    total.short_description = 'Total'


@admin.register(Orden)
class OrdenAdmin(admin.ModelAdmin):
    list_display = ['id', 'usuario', 'estado', 'total', 'creado']
    list_filter = ['estado']
    search_fields = ['usuario__username', 'usuario__email']
    readonly_fields = ['creado', 'total']
    inlines = [ItemOrdenInline]
