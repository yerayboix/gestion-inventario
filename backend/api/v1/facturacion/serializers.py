from rest_framework import serializers
from facturacion.models import Factura, LineaFactura
from inventario.models import Libro
from facturacion.models import Empresa

class LibroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Libro
        fields = '__all__'

class LineaFacturaSerializer(serializers.ModelSerializer):
    libro = LibroSerializer()
    class Meta:
        model = LineaFactura
        fields = '__all__'

class LineaFacturaCreateSerializer(serializers.ModelSerializer):
    factura = serializers.PrimaryKeyRelatedField(queryset=Factura.objects.all(), required=False)
    
    class Meta:
        model = LineaFactura
        fields = ['libro', 'cantidad', 'precio', 'descuento', 'importe', 'factura']

class LineaFacturaUpdateSerializer(serializers.ModelSerializer):
    factura = serializers.PrimaryKeyRelatedField(queryset=Factura.objects.all(), required=False)
    
    class Meta:
        model = LineaFactura
        fields = ['libro', 'cantidad', 'precio', 'descuento', 'importe', 'factura']

class FacturaSerializer(serializers.ModelSerializer):
    lineas = LineaFacturaSerializer(many=True, read_only=True)

    class Meta:
        model = Factura
        fields = '__all__'

class FacturaCreateSerializer(serializers.ModelSerializer):
    lineas = LineaFacturaCreateSerializer(many=True, required=False)

    class Meta:
        model = Factura
        fields = [
            'fecha', 'cliente', 'nombre', 'nif', 'domicilio', 'cp_ciudad', 
            'telefono', 'descuento', 'base_iva', 'iva', 'recargo_equivalencia', 
            'gastos_envio', 'total', 'notas', 'estado', 'lineas'
        ]

    def create(self, validated_data):
        lineas_data = validated_data.pop('lineas', [])
        factura = Factura.objects.create(**validated_data)
        
        # Crear las líneas de factura
        for linea_data in lineas_data:
            LineaFactura.objects.create(factura=factura, **linea_data)
        
        return factura

class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = ['id', 'nombre', 'direccion', 'nif', 'gif', 'iban', 'created_on', 'updated_on']
        read_only_fields = ['id', 'created_on', 'updated_on']

class EmpresaUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = ['nombre', 'direccion', 'nif', 'gif', 'iban'] 