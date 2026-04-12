"""
URL configuration for Elitian project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from apps.tienda.auth_views import registro, me
from .views import index, conocenos, recicla, contacto


urlpatterns = [
    path('admin/', admin.site.urls),
    # API v1
    path('api/v1/', include('apps.tienda.api_urls')),
    path('api/v1/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/auth/registro/', registro, name='registro'),
    path('api/v1/auth/me/', me, name='me'),
    # Legacy Django templates (se puede eliminar cuando Next.js esté completo)
    path('', index, name='index'),
    path('', include('apps.tienda.urls')),
    path('', include('apps.blog.urls')),
    path('conocenos', conocenos, name='conocenos'),
    path('recicla', recicla, name='recicla'),
    path('contacto', contacto, name='contacto'),
    path('ckeditor/', include('ckeditor_uploader.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)