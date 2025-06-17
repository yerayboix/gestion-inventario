from rest_framework import serializers
from facturacion.models import Factura, LineaFactura

class LineaFacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = LineaFactura
        fields = '__all__'

class FacturaSerializer(serializers.ModelSerializer):
    lineas = LineaFacturaSerializer(many=True, read_only=True, source='lineafactura_set')

    class Meta:
        model = Factura
        fields = '__all__' 