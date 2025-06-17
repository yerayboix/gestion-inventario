# Gestión de Inventario

Aplicación de gestión de inventario construida con Next.js (frontend) y Django + Django REST Framework (backend) utilizando Turso como base de datos.

## Estructura del Proyecto

```
gestion-inventario/
├── frontend/           # Aplicación Next.js
└── backend/           # Aplicación Django
```

## Requisitos Previos

- Python 3.8+
- Node.js 18+
- npm o yarn
- Turso CLI

## Configuración del Backend

1. Crear y activar entorno virtual:
```bash
python -m venv .venv
source .venv/bin/activate  # En Unix/macOS
# o
.venv\Scripts\activate  # En Windows
```

2. Instalar dependencias:
```bash
cd backend
pip install -r requirements.txt
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. Ejecutar migraciones:
```bash
python manage.py migrate
```

5. Iniciar servidor de desarrollo:
```bash
python manage.py runserver
```

## Configuración del Frontend

1. Instalar dependencias:
```bash
cd frontend
npm install
# o
yarn install
```

2. Configurar variables de entorno:

  - Configuración en /backend

  ```bash
      # Django Backend Configuration
    DJANGO_SECRET_KEY=
    DJANGO_DEBUG=
    DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,aws-0-eu-west-3.pooler.supabase.com

    # Database Configuration
    DATABASE_NAME=
    DATABASE_USER=
    DATABASE_HOST=
    DATABASE_PORT=
    DATABASE_PASSWORD=
  ```

  - Configuración en /frontend
  ```bash
    # Next.js Frontend Configuration
    NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
    NEXT_PUBLIC_APP_URL=http://localhost:3000
  ```


3. Iniciar servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

## Tecnologías Utilizadas

- **Frontend**:
  - Next.js
  - React
  - Tailwind CSS
  - TypeScript

- **Backend**:
  - Django
  - Django REST Framework
  - Supabase
  - Python 3.8+

## Licencia

MIT 