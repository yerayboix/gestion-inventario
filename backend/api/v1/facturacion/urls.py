from rest_framework.routers import DefaultRouter
from .views import FacturaViewSet, LineaFacturaViewSet

router = DefaultRouter()
router.register('facturas', FacturaViewSet, basename='factura')
router.register('lineas-factura', LineaFacturaViewSet, basename='lineafactura')

urlpatterns = router.urls 