from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FacturaViewSet, LineaFacturaViewSet, EmpresaViewSet

router = DefaultRouter()
router.register(r'facturas', FacturaViewSet)
router.register(r'lineas-factura', LineaFacturaViewSet)
router.register(r'empresa', EmpresaViewSet, basename='empresa')

urlpatterns = [
    path('', include(router.urls)),
] 