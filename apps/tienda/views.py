from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator
from django.db.models import Q, Avg
from .models import Categorias, Productos


def tienda(request):
    categorias = Categorias.objects.filter(activo=True)
    destacados = Productos.objects.filter(
        activo=True, destacado=True, stock__gt=0
    ).prefetch_related('imagenes').order_by('-creado')[:8]
    return render(request, 'tienda/tienda.html', {
        'categorias': categorias,
        'destacados': destacados,
    })


def tienda_categoria(request, slug):
    categoria = get_object_or_404(Categorias, slug=slug, activo=True)
    qs = Productos.objects.filter(
        categoria=categoria, activo=True
    ).prefetch_related('imagenes')

    q = request.GET.get('q', '').strip()
    if q:
        qs = qs.filter(Q(nombre__icontains=q) | Q(marca__icontains=q))

    orden = request.GET.get('orden', 'nombre')
    mapa_orden = {
        'nombre': 'nombre',
        'precio_asc': 'precio',
        'precio_desc': '-precio',
        'novedad': '-creado',
    }
    qs = qs.order_by(mapa_orden.get(orden, 'nombre'))

    paginator = Paginator(qs, 12)
    productos = paginator.get_page(request.GET.get('page', 1))

    return render(request, 'tienda/tienda_categoria.html', {
        'categoria': categoria,
        'productos': productos,
        'busqueda': q,
        'orden': orden,
        'total_resultados': paginator.count,
    })


def tienda_producto(request, categoria_slug, producto_slug):
    producto = get_object_or_404(
        Productos.objects.select_related('categoria').prefetch_related(
            'imagenes', 'resenas__usuario'
        ),
        slug=producto_slug,
        categoria__slug=categoria_slug,
        activo=True,
    )
    resenas = producto.resenas.filter(aprobado=True)
    calificacion_promedio = resenas.aggregate(Avg('calificacion'))['calificacion__avg']

    relacionados = Productos.objects.filter(
        categoria=producto.categoria, activo=True, stock__gt=0
    ).exclude(pk=producto.pk).prefetch_related('imagenes')[:4]

    return render(request, 'tienda/tienda_producto.html', {
        'producto': producto,
        'resenas': resenas,
        'calificacion_promedio': calificacion_promedio,
        'relacionados': relacionados,
    })
