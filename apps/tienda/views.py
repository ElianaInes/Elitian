from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from .forms import LoginForm, RegistrationForm, CustomPasswordResetForm
from .models import Categorias, Productos


@login_required
def tienda(request):
    categorias_list = Categorias.objects.all()
    return render(request, 'tienda/tienda.html', {'categorias_list': categorias_list})

def tienda_categoria(request, slug):
    categoria = get_object_or_404(Categorias, slug=slug)
    productos_list = Productos.objects.filter(categoria=categoria)
    return render(request, 'tienda/tienda_categoria.html', {'categoria': categoria, 'productos_list': productos_list})

def tienda_producto(request, categoria_slug, producto_slug):
    categoria = get_object_or_404(Categorias, slug=categoria_slug)
    producto = get_object_or_404(Productos, slug=producto_slug, categoria=categoria)
    imagenes = [producto.imagen]
    return render(request, 'tienda/tienda_producto.html', {'categoria': categoria, 'producto': producto, 'imagenes': imagenes})

#create your views here.
@login_required
def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                if user.is_active:
                    login(request, user)
                    return HttpResponse('Usuario autenticado')
                else:
                    return HttpResponse('El usuario no está activo')
            else:
                return HttpResponse('La información no es correcta')
        # Redirige a la página de inicio o a donde desees
        return redirect('tienda/tienda.html')
    else:
        form = LoginForm()
    return render(request, 'registration/login.html', {'form': form})

@login_required
def logout_view(request):
    logout(request)
    # Redirige a la página de inicio o a donde desees
    return redirect('index')

@login_required
def register_view(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            # Redirige a la página de inicio o a donde desees
            return redirect('registration/register.html')
    else:
        form = RegistrationForm()
    return render(request, 'registration/register_complete.html', {'form': form})

@login_required
def password_reset_view(request):
    form = CustomPasswordResetForm(request.POST or None)
    if form.is_valid():
        form.save(request=request)
        # Redirige a la página de confirmación de contraseña reseteada
        return redirect('registration/password_reset_done.html')
    return render(request, 'registration/password_reset_form.html', {'form': form})