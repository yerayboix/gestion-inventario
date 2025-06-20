from django.urls import path
from . import views

app_name = 'facturacion'

urlpatterns = [
    path('factura/<int:factura_id>/pdf/', views.factura_pdf, name='factura_pdf'),
] 