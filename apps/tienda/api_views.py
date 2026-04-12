from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import Categorias, Productos, Resena, Carrito, ItemCarrito, Orden, ItemOrden
from .serializers import (
    CategoriaSerializer,
    ProductoListSerializer,
    ProductoDetailSerializer,
    ResenaSerializer,
    ResenaCreateSerializer,
    CarritoSerializer,
    ItemCarritoSerializer,
    OrdenSerializer,
)


class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categorias.objects.filter(activo=True)
    serializer_class = CategoriaSerializer
    lookup_field = 'slug'


class ProductoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Productos.objects.filter(activo=True).select_related('categoria').prefetch_related('imagenes')
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'marca', 'descripcion']
    ordering_fields = ['precio', 'nombre', 'creado']
    ordering = ['nombre']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductoDetailSerializer
        return ProductoListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        categoria = self.request.query_params.get('categoria')
        destacado = self.request.query_params.get('destacado')
        con_stock = self.request.query_params.get('con_stock')
        precio_min = self.request.query_params.get('precio_min')
        precio_max = self.request.query_params.get('precio_max')

        if categoria:
            qs = qs.filter(categoria__slug=categoria)
        if destacado == 'true':
            qs = qs.filter(destacado=True)
        if con_stock == 'true':
            qs = qs.filter(stock__gt=0)
        if precio_min:
            qs = qs.filter(precio__gte=precio_min)
        if precio_max:
            qs = qs.filter(precio__lte=precio_max)
        return qs

    @action(detail=True, methods=['get'])
    def resenas(self, request, slug=None):
        producto = self.get_object()
        resenas = producto.resenas.filter(aprobado=True)
        serializer = ResenaSerializer(resenas, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def agregar_resena(self, request, slug=None):
        producto = self.get_object()
        if producto.resenas.filter(usuario=request.user).exists():
            return Response(
                {'detail': 'Ya dejaste una reseña para este producto.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = ResenaCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(producto=producto, usuario=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def relacionados(self, request, slug=None):
        producto = self.get_object()
        relacionados = Productos.objects.filter(
            categoria=producto.categoria, activo=True, stock__gt=0
        ).exclude(pk=producto.pk).prefetch_related('imagenes')[:4]
        serializer = ProductoListSerializer(relacionados, many=True, context={'request': request})
        return Response(serializer.data)


class CarritoViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def _get_carrito(self, user):
        carrito, _ = Carrito.objects.get_or_create(usuario=user)
        return carrito

    def list(self, request):
        carrito = self._get_carrito(request.user)
        serializer = CarritoSerializer(carrito, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def agregar(self, request):
        carrito = self._get_carrito(request.user)
        producto_id = request.data.get('producto_id')
        cantidad = int(request.data.get('cantidad', 1))

        producto = get_object_or_404(Productos, pk=producto_id, activo=True)

        if not producto.tiene_stock_disponible(cantidad):
            return Response(
                {'detail': f'Stock insuficiente. Disponible: {producto.stock}'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        item, created = ItemCarrito.objects.get_or_create(
            carrito=carrito, producto=producto,
            defaults={'cantidad': cantidad},
        )
        if not created:
            nueva_cantidad = item.cantidad + cantidad
            if not producto.tiene_stock_disponible(nueva_cantidad):
                return Response(
                    {'detail': f'Stock insuficiente. Disponible: {producto.stock}'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            item.cantidad = nueva_cantidad
            item.save()

        serializer = CarritoSerializer(carrito, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['patch'])
    def actualizar(self, request):
        carrito = self._get_carrito(request.user)
        item_id = request.data.get('item_id')
        cantidad = int(request.data.get('cantidad', 1))

        item = get_object_or_404(ItemCarrito, pk=item_id, carrito=carrito)

        if cantidad < 1:
            item.delete()
        else:
            if not item.producto.tiene_stock_disponible(cantidad):
                return Response(
                    {'detail': f'Stock insuficiente. Disponible: {item.producto.stock}'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            item.cantidad = cantidad
            item.save()

        serializer = CarritoSerializer(carrito, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['delete'])
    def eliminar(self, request):
        carrito = self._get_carrito(request.user)
        item_id = request.data.get('item_id')
        item = get_object_or_404(ItemCarrito, pk=item_id, carrito=carrito)
        item.delete()
        serializer = CarritoSerializer(carrito, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['delete'])
    def vaciar(self, request):
        carrito = self._get_carrito(request.user)
        carrito.items.all().delete()
        serializer = CarritoSerializer(carrito, context={'request': request})
        return Response(serializer.data)


class OrdenViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrdenSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Orden.objects.filter(usuario=self.request.user).prefetch_related('items__producto')

    @action(detail=False, methods=['post'])
    def crear(self, request):
        carrito = get_object_or_404(Carrito, usuario=request.user)

        if not carrito.items.exists():
            return Response(
                {'detail': 'El carrito está vacío.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verificar stock antes de crear la orden
        for item in carrito.items.select_related('producto').all():
            if not item.producto.tiene_stock_disponible(item.cantidad):
                return Response(
                    {'detail': f'Sin stock suficiente para "{item.producto.nombre}".'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        orden = Orden.objects.create(
            usuario=request.user,
            total=carrito.total,
            notas=request.data.get('notas', ''),
        )

        for item in carrito.items.select_related('producto').all():
            ItemOrden.objects.create(
                orden=orden,
                producto=item.producto,
                cantidad=item.cantidad,
                precio_unitario=item.producto.precio_final,
            )
            # Descontar stock
            item.producto.stock -= item.cantidad
            item.producto.save(update_fields=['stock'])

        carrito.items.all().delete()

        serializer = OrdenSerializer(orden)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
