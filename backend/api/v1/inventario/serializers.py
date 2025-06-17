from rest_framework import serializers
from inventario.models import Libro

class LibroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Libro
        fields = ['id', 'titulo', 'pvp', 'precio', 'cantidad'] 