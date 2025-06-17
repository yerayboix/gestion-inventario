from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from inventario.models import Libro
from .serializers import LibroSerializer
from .filters import LibroFilter

class LibroViewSet(viewsets.ModelViewSet):
    queryset = Libro.objects.all().order_by('titulo')
    serializer_class = LibroSerializer
    filterset_class = LibroFilter
    filter_backends = [DjangoFilterBackend]