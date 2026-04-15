from django.shortcuts import render
from apps.tienda.models import Productos


def index(request):
    productos_destacados = (
        Productos.objects
        .filter(activo=True, destacado=True, stock__gt=0)
        .prefetch_related('imagenes')[:8]
    )
    return render(request, 'index.html', {'productos_destacados': productos_destacados})

def conocenos(request):
    return render(request, 'conocenos.html')

def recicla(request):
    return render(request, 'recicla.html')

def contacto(request):
    return render(request, 'contacto.html')