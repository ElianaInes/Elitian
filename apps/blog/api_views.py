from rest_framework import serializers, viewsets, filters
from rest_framework.permissions import AllowAny
from .models import Post, Categoria


class BlogCategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'slug', 'descripcion', 'imagen_cat']


class PostListSerializer(serializers.ModelSerializer):
    categoria = BlogCategoriaSerializer(read_only=True)
    autor_nombre = serializers.SerializerMethodField()
    imagen_post = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'titulo', 'subtitulo', 'slug',
            'categoria', 'autor_nombre',
            'imagen_post', 'etiqueta', 'creado',
        ]

    def get_autor_nombre(self, obj):
        nombre = f'{obj.autor.first_name} {obj.autor.last_name}'.strip()
        return nombre or obj.autor.username

    def get_imagen_post(self, obj):
        if obj.imagen_post:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.imagen_post.url)
            return obj.imagen_post.url
        return None


class PostDetailSerializer(PostListSerializer):
    class Meta(PostListSerializer.Meta):
        fields = PostListSerializer.Meta.fields + ['contenido']


class BlogCategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.filter(activo=True)
    serializer_class = BlogCategoriaSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class PostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Post.objects.select_related('categoria', 'autor').order_by('-creado')
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['titulo', 'subtitulo', 'etiqueta']
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PostDetailSerializer
        return PostListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        categoria = self.request.query_params.get('categoria')
        if categoria:
            qs = qs.filter(categoria__slug=categoria)
        return qs
