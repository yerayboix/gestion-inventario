from django.urls import path, include

urlpatterns = [
    path('inventario/', include('api.v1.inventario.urls')),
] 