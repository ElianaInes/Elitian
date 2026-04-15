from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator


class Categorias(models.Model):
    nombre = models.CharField(max_length=50)
    slug = models.SlugField(unique=True, blank=True)
    descripcion = models.CharField(max_length=300, blank=True)
    imagen = models.ImageField(upload_to='tienda_images/categorias', null=True, blank=True)
    activo = models.BooleanField(default=True)
    orden = models.PositiveSmallIntegerField(default=0)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('tienda_categoria', kwargs={'slug': self.slug})

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'
        ordering = ['orden', 'nombre']


class Productos(models.Model):
    codigo = models.CharField(max_length=6, unique=True)
    nombre = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    categoria = models.ForeignKey(
        Categorias, on_delete=models.PROTECT, related_name='productos'
    )
    ofrecido = models.CharField(max_length=50, blank=True)
    marca = models.CharField(max_length=50)
    precio = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)]
    )
    precio_oferta = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    descripcion = models.TextField(blank=True)
    ingredientes = models.TextField(blank=True)
    modo_uso = models.TextField(blank=True)
    conservacion = models.TextField(blank=True)
    cont_peso_neto = models.CharField(max_length=10, blank=True)
    destacado = models.BooleanField(default=False)
    activo = models.BooleanField(default=True)
    stock = models.PositiveIntegerField(default=0)
    descuento = models.PositiveSmallIntegerField(default=0)  # porcentaje 0–100
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    @property
    def precio_final(self):
        if self.precio_oferta:
            return self.precio_oferta
        if self.descuento:
            return round(self.precio * (1 - self.descuento / 100), 2)
        return self.precio

    @property
    def tiene_oferta(self):
        return bool(self.precio_oferta or self.descuento)

    @property
    def imagen_principal(self):
        img = self.imagenes.filter(principal=True).first()
        return img or self.imagenes.first()

    def tiene_stock_disponible(self, cantidad=1):
        return self.stock >= cantidad

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('tienda_producto', kwargs={
            'categoria_slug': self.categoria.slug,
            'producto_slug': self.slug,
        })

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
        ordering = ['nombre']


class ProductoImagen(models.Model):
    producto = models.ForeignKey(
        Productos, on_delete=models.CASCADE, related_name='imagenes'
    )
    imagen = models.ImageField(upload_to='tienda_images/productos')
    principal = models.BooleanField(default=False)
    orden = models.PositiveSmallIntegerField(default=0)

    def __str__(self):
        return f'Imagen de {self.producto.nombre}'

    class Meta:
        ordering = ['-principal', 'orden']
        verbose_name = 'Imagen'
        verbose_name_plural = 'Imágenes'


class Resena(models.Model):
    producto = models.ForeignKey(
        Productos, on_delete=models.CASCADE, related_name='resenas'
    )
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    comentario = models.TextField()
    calificacion = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    creado = models.DateTimeField(auto_now_add=True)
    aprobado = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.usuario} — {self.producto} ({self.calificacion}★)'

    class Meta:
        unique_together = ('producto', 'usuario')
        verbose_name = 'Reseña'
        verbose_name_plural = 'Reseñas'
        ordering = ['-creado']


class Carrito(models.Model):
    usuario = models.OneToOneField(
        User, on_delete=models.CASCADE, null=True, blank=True
    )
    session_key = models.CharField(max_length=40, null=True, blank=True)
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    @property
    def total(self):
        return sum(item.subtotal for item in self.items.select_related('producto').all())

    @property
    def cantidad_items(self):
        return sum(item.cantidad for item in self.items.all())

    def __str__(self):
        ident = self.usuario or self.session_key
        return f'Carrito de {ident}'

    class Meta:
        verbose_name = 'Carrito'
        verbose_name_plural = 'Carritos'


class ItemCarrito(models.Model):
    carrito = models.ForeignKey(
        Carrito, on_delete=models.CASCADE, related_name='items'
    )
    producto = models.ForeignKey(Productos, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)

    @property
    def subtotal(self):
        return self.producto.precio_final * self.cantidad

    def __str__(self):
        return f'{self.cantidad}x {self.producto.nombre}'

    class Meta:
        unique_together = ('carrito', 'producto')
        verbose_name = 'Ítem de carrito'
        verbose_name_plural = 'Ítems de carrito'


class Orden(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('confirmado', 'Confirmado'),
        ('enviado', 'Enviado'),
        ('entregado', 'Entregado'),
        ('cancelado', 'Cancelado'),
    ]
    METODO_PAGO_CHOICES = [
        ('transferencia', 'Transferencia bancaria'),
        ('efectivo', 'Efectivo al retirar'),
        ('tarjeta', 'Tarjeta de crédito'),
    ]
    METODOS_CON_DESCUENTO = {'transferencia', 'efectivo'}
    DESCUENTO_PORCENTAJE = 20

    usuario = models.ForeignKey(
        User, on_delete=models.PROTECT, related_name='ordenes'
    )
    estado = models.CharField(
        max_length=20, choices=ESTADO_CHOICES, default='pendiente'
    )
    metodo_pago = models.CharField(
        max_length=20, choices=METODO_PAGO_CHOICES, default='transferencia'
    )
    total = models.DecimalField(max_digits=12, decimal_places=2)
    descuento_aplicado = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    creado = models.DateTimeField(auto_now_add=True)
    notas = models.TextField(blank=True)

    def __str__(self):
        return f'Orden #{self.pk} — {self.usuario} [{self.get_estado_display()}]'

    class Meta:
        verbose_name = 'Orden'
        verbose_name_plural = 'Órdenes'
        ordering = ['-creado']


class ItemOrden(models.Model):
    orden = models.ForeignKey(
        Orden, on_delete=models.CASCADE, related_name='items'
    )
    producto = models.ForeignKey(Productos, on_delete=models.PROTECT)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    @property
    def subtotal(self):
        return self.precio_unitario * self.cantidad

    def __str__(self):
        return f'{self.cantidad}x {self.producto.nombre} @ ${self.precio_unitario}'

    class Meta:
        verbose_name = 'Ítem de orden'
        verbose_name_plural = 'Ítems de orden'
