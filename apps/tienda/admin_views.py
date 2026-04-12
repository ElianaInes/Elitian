from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta

from .models import Productos, Orden, Categorias
from .serializers import OrdenSerializer, ProductoListSerializer


@api_view(['GET'])
@permission_classes([IsAdminUser])
def stats(request):
    hoy = timezone.now()
    hace_30 = hoy - timedelta(days=30)

    ordenes_qs = Orden.objects.all()
    ordenes_mes = ordenes_qs.filter(creado__gte=hace_30)

    total_ventas = ordenes_qs.filter(
        estado__in=['confirmado', 'enviado', 'entregado']
    ).aggregate(total=Sum('total'))['total'] or 0

    ventas_mes = ordenes_mes.filter(
        estado__in=['confirmado', 'enviado', 'entregado']
    ).aggregate(total=Sum('total'))['total'] or 0

    return Response({
        'ordenes_total': ordenes_qs.count(),
        'ordenes_pendientes': ordenes_qs.filter(estado='pendiente').count(),
        'ordenes_mes': ordenes_mes.count(),
        'ventas_total': float(total_ventas),
        'ventas_mes': float(ventas_mes),
        'productos_total': Productos.objects.count(),
        'productos_sin_stock': Productos.objects.filter(stock=0).count(),
        'usuarios_total': User.objects.filter(is_staff=False).count(),
        'estados': list(
            ordenes_qs.values('estado').annotate(cantidad=Count('id'))
        ),
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def ordenes_admin(request):
    estado = request.query_params.get('estado', '')
    qs = Orden.objects.select_related('usuario').prefetch_related('items__producto').order_by('-creado')
    if estado:
        qs = qs.filter(estado=estado)
    serializer = OrdenSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def orden_estado(request, pk):
    try:
        orden = Orden.objects.get(pk=pk)
    except Orden.DoesNotExist:
        return Response({'detail': 'Orden no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

    nuevo_estado = request.data.get('estado', '')
    estados_validos = [e[0] for e in Orden.ESTADO_CHOICES]
    if nuevo_estado not in estados_validos:
        return Response({'detail': 'Estado inválido.'}, status=status.HTTP_400_BAD_REQUEST)

    orden.estado = nuevo_estado
    orden.save()
    return Response(OrdenSerializer(orden).data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def productos_admin(request):
    search = request.query_params.get('search', '')
    activo = request.query_params.get('activo', '')
    qs = Productos.objects.select_related('categoria').order_by('-creado')
    if search:
        qs = qs.filter(nombre__icontains=search)
    if activo in ('true', 'false'):
        qs = qs.filter(activo=activo == 'true')
    serializer = ProductoListSerializer(qs, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def producto_toggle(request, pk):
    try:
        producto = Productos.objects.get(pk=pk)
    except Productos.DoesNotExist:
        return Response({'detail': 'Producto no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    producto.activo = not producto.activo
    producto.save()
    return Response({'id': producto.id, 'activo': producto.activo})
