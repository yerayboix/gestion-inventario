import os
import sys
import django
import pandas as pd

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from inventario.models import Libro

def import_libros_from_excel(excel_path):
    try:
        # Leer el archivo Excel
        df = pd.read_excel(excel_path)
        
        # Limpiar los nombres (eliminar espacios en blanco al inicio y final)
        df['TITULO'] = df['TITULO'].str.strip()
        
        # Contadores para el resumen
        libros_creados = 0
        libros_actualizados = 0
        
        # Iterar sobre las filas y crear o actualizar los libros
        for _, row in df.iterrows():
            titulo = row['TITULO']
            cantidad = row['DEP'] if pd.notna(row['DEP']) else 0
            print(f"Titulo: {titulo}, Cantidad: {cantidad}")
            
            # Convertir la cantidad a entero
            try:
                cantidad = int(cantidad)
            except (ValueError, TypeError):
                print(f"Advertencia: Cantidad no válida para '{titulo}', usando 0")
                cantidad = 0
            
            # Intentar obtener el libro existente o crear uno nuevo
            libro, created = Libro.objects.update_or_create(
                titulo=titulo,  # Campo para buscar coincidencia
                defaults={
                    'cantidad': cantidad,
                }
            )
            
            if created:
                libros_creados += 1
                print(f"Libro creado: {titulo} (Cantidad: {cantidad})")
            else:
                libros_actualizados += 1
                print(f"Libro actualizado: {titulo} (Cantidad: {cantidad})")
        
        print(f"\nProceso completado:")
        print(f"- Libros nuevos creados: {libros_creados}")
        print(f"- Libros existentes actualizados: {libros_actualizados}")
        print(f"- Total procesados: {libros_creados + libros_actualizados}")
        
    except Exception as e:
        print(f"Error al procesar el archivo: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Uso: python import_libros.py <ruta_del_excel>")
        sys.exit(1)
    
    excel_path = sys.argv[1]
    if not os.path.exists(excel_path):
        print(f"El archivo {excel_path} no existe.")
        sys.exit(1)
    
    import_libros_from_excel(excel_path) 