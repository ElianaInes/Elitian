from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class Categorias(models.Model):
    nombre = models.CharField(max_length=50)
    slug = models.SlugField(unique=True, blank=True, null=True)
    activo = models.BooleanField(default = True)

    def __str__(self) -> str:
        return self.nombre
    
    class Meta:
        verbose_name_plural = 'Categoria'
    
class Productos(models.Model):
    codigo = models.CharField(max_length = 6, primary_key = True)
    nombre = models.CharField(max_length = 100)
    slug = models.SlugField(unique = True, blank=True, null=True)
    categoria = models.ForeignKey(Categorias, on_delete = models.CASCADE)
    ofrecido = models.CharField(max_length = 50, null=True)
    marca = models.CharField(max_length = 50)
    precio = models.DecimalField(max_digits = 10, decimal_places = 2, default = 0.00)
    precio_oferta = models.DecimalField(max_digits=10, decimal_places=2, default = 0.00, null=True, blank=True)
    descripcion = models.TextField(blank = True, null = True)
    ingredientes = models.TextField(blank = True, null = True)
    modo_uso = models.TextField(blank = True, null = True)
    conservacion = models.TextField(blank = True, null = True)
    cont_peso_neto = models.CharField(max_length = 10, default=0)
    destacado = models.BooleanField(default = True)
    activo = models.BooleanField(default = True)
    stock = models.PositiveIntegerField(default= 0)
    descuento = models.IntegerField(default = 0)
    imagen = models.ImageField(upload_to='tienda_images/productos', null=True)
    imagen2 = models.ImageField(upload_to='tienda_images/productos', null=True)
    imagen3 = models.ImageField(upload_to='tienda_images/productos', null=True)
    
    def tiene_stock_disponible(self, cantidad):
        return self.stock >= cantidad

    def __str__(self) -> str:
        return self.nombre
    
    class Meta:
        verbose_name_plural = 'Producto'

class Carrito(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    productos = models.ManyToManyField(Productos, through='ItemCarrito')

class ItemCarrito(models.Model):
    producto = models.ForeignKey(Productos, on_delete=models.CASCADE)
    carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)
    
class Resena(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    producto = models.ForeignKey(Productos, on_delete=models.CASCADE)
    comentario = models.TextField()
    calificacion = models.PositiveIntegerField(default=5)  # Escala del 1 al 5


class Estadistica(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    producto = models.ForeignKey(Productos, on_delete=models.CASCADE)
    cantidad_vendida = models.PositiveIntegerField(default=0)
    total_ventas = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    @classmethod
    def actualizar_estadisticas(cls, usuario, producto, cantidad, monto):
        estadistica, creado = cls.objects.get_or_create(usuario=usuario, producto=producto)
        estadistica.cantidad_vendida += cantidad
        estadistica.total_ventas += monto
        estadistica.save()

    @classmethod
    def obtener_productos_mas_vendidos(cls, top_n=5):
        productos_mas_vendidos = cls.objects.order_by('-cantidad_vendida')[:top_n]
        return productos_mas_vendidos
