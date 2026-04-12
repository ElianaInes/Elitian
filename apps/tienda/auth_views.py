from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


@api_view(['POST'])
@permission_classes([AllowAny])
def registro(request):
    username = request.data.get('username', '').strip()
    email = request.data.get('email', '').strip()
    password = request.data.get('password', '')
    first_name = request.data.get('first_name', '').strip()
    last_name = request.data.get('last_name', '').strip()

    errors = {}

    if not username:
        errors['username'] = 'El nombre de usuario es requerido.'
    elif User.objects.filter(username=username).exists():
        errors['username'] = 'Ese nombre de usuario ya está en uso.'

    if not email:
        errors['email'] = 'El email es requerido.'
    elif User.objects.filter(email=email).exists():
        errors['email'] = 'Ya existe una cuenta con ese email.'

    if not password:
        errors['password'] = 'La contraseña es requerida.'
    else:
        try:
            validate_password(password)
        except ValidationError as e:
            errors['password'] = list(e.messages)

    if errors:
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
    )

    refresh = RefreshToken.for_user(user)
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_staff': user.is_staff,
        },
    }, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PATCH'])
def me(request):
    user = request.user

    if request.method == 'GET':
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_staff': user.is_staff,
        })

    # PATCH — actualizar perfil
    errors = {}
    first_name = request.data.get('first_name', '').strip()
    last_name = request.data.get('last_name', '').strip()
    email = request.data.get('email', '').strip()

    if not first_name:
        errors['first_name'] = 'El nombre es requerido.'
    if not email:
        errors['email'] = 'El email es requerido.'
    elif User.objects.filter(email=email).exclude(pk=user.pk).exists():
        errors['email'] = 'Ese email ya está en uso por otra cuenta.'

    if errors:
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    user.first_name = first_name
    user.last_name = last_name
    user.email = email
    user.save()

    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_staff': user.is_staff,
    })


@api_view(['POST'])
def cambiar_password(request):
    user = request.user
    actual = request.data.get('password_actual', '')
    nueva = request.data.get('password_nueva', '')

    errors = {}

    if not user.check_password(actual):
        errors['password_actual'] = 'La contraseña actual es incorrecta.'

    if not nueva:
        errors['password_nueva'] = 'La nueva contraseña es requerida.'
    else:
        try:
            validate_password(nueva, user)
        except ValidationError as e:
            errors['password_nueva'] = list(e.messages)

    if errors:
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(nueva)
    user.save()
    return Response({'detail': 'Contraseña actualizada correctamente.'})
