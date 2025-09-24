# Book Warehouse Inventory & Billing Management System

A comprehensive web application for managing book warehouse inventory and invoice processing, built with Next.js (frontend) and Django + Django REST Framework (backend) using Supabase as the database.

> **Note**: This is currently a Minimum Viable Product (MVP) with core functionality implemented. Some features are still in development or planned for future releases.

## Features

### 📚 Inventory Management
- **Book Catalog**: Complete book management with title, retail price (PVP), wholesale price, discount, and stock quantity
- **Stock Control**: Real-time stock tracking with automatic updates on sales
- **Bulk Import**: Excel import functionality for adding multiple books
- **Search & Filter**: Advanced filtering by title, price, quantity, and discount

### 🧾 Invoice Management
- **Invoice Creation**: Create draft invoices with automatic numbering
- **Invoice States**: Draft → Issued → Paid → Cancelled workflow
- **Customer Management**: Store customer details including name, NIF/CIF, address, and contact information
- **Line Items**: Add multiple books per invoice with quantities, prices, and line-level discounts
- **Tax Calculation**: Automatic VAT calculation with configurable rates
- **PDF Generation**: Professional invoice PDF generation for printing and email
- **Stock Integration**: Automatic stock reduction when invoices are issued

### ⚙️ System Configuration
- **Company Settings**: Configure company information for invoice headers
- **User Authentication**: Secure user authentication and authorization
- **Audit Trail**: Track creation and modification dates for all records

### 📊 Dashboard
- **Overview**: Summary of key metrics and recent activity
- **Real-time Data**: Live updates of inventory levels and invoice status *(In Development)*

## Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Form handling with validation
- **Clerk** - Authentication and user management
- **Lucide React** - Modern icon library
- **Zod** - Schema validation

### Backend
- **Django 5.2** - High-level Python web framework
- **Django REST Framework** - Powerful toolkit for building Web APIs
- **Supabase** - PostgreSQL database with real-time features
- **Django CORS Headers** - Cross-origin resource sharing
- **Django Filter** - Advanced filtering capabilities
- **WeasyPrint** - PDF generation from HTML/CSS
- **Pandas & OpenPyXL** - Excel file processing

## Project Structure

```
gestion-inventario/
├── frontend/           # Next.js application
│   ├── app/           # App Router pages
│   ├── components/    # Reusable UI components
│   ├── lib/          # Utilities, types, and actions
│   └── hooks/        # Custom React hooks
└── backend/          # Django application
    ├── inventario/   # Inventory management app
    ├── facturacion/  # Billing/invoice management app
    ├── api/         # REST API endpoints
    └── scripts/     # Utility scripts
```

## Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn
- Supabase account

## Backend Setup

1. **Create and activate virtual environment:**
```bash
python -m venv .venv
source .venv/bin/activate  # On Unix/macOS
# or
.venv\Scripts\activate  # On Windows
```

2. **Install dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

3. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your configurations
```

**Backend Environment Variables:**
```bash
# Django Backend Configuration
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com

# Database Configuration (Supabase)
DATABASE_NAME=your-database-name
DATABASE_USER=your-database-user
DATABASE_HOST=your-supabase-host
DATABASE_PORT=5432
DATABASE_PASSWORD=your-database-password
```

4. **Run migrations:**
```bash
python manage.py migrate
```

5. **Create superuser (optional):**
```bash
python manage.py createsuperuser
```

6. **Start development server:**
```bash
python manage.py runserver
```

The backend API will be available at `http://127.0.0.1:8000/api/v1/`

## Frontend Setup

1. **Install dependencies:**
```bash
cd frontend
npm install
# or
yarn install
```

2. **Configure environment variables:**

Create `.env.local` file in the frontend directory:

```bash
# Next.js Frontend Configuration
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk Authentication (get from clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

3. **Start development server:**
```bash
npm run dev
# or
yarn dev
```

The frontend application will be available at `http://localhost:3000`

## API Endpoints

### Inventory
- `GET /api/v1/inventario/libros/` - List all books
- `POST /api/v1/inventario/libros/` - Create new book
- `GET /api/v1/inventario/libros/{id}/` - Get book details
- `PUT /api/v1/inventario/libros/{id}/` - Update book
- `DELETE /api/v1/inventario/libros/{id}/` - Delete book

### Invoicing
- `GET /api/v1/facturacion/facturas/` - List all invoices
- `POST /api/v1/facturacion/facturas/` - Create new invoice
- `GET /api/v1/facturacion/facturas/{id}/` - Get invoice details
- `PUT /api/v1/facturacion/facturas/{id}/` - Update invoice
- `DELETE /api/v1/facturacion/facturas/{id}/` - Delete invoice (drafts only)

### Invoice Lines
- `GET /api/v1/facturacion/lineas-factura/` - List invoice lines
- `POST /api/v1/facturacion/lineas-factura/` - Add line to invoice
- `PUT /api/v1/facturacion/lineas-factura/{id}/` - Update invoice line
- `DELETE /api/v1/facturacion/lineas-factura/{id}/` - Remove invoice line

## Key Features Explained

### Stock Management
- **Automatic Stock Control**: Stock is automatically reduced when invoices are created as drafts
- **Stock Recovery**: Stock is restored when invoices are cancelled or deleted
- **Stock Validation**: System prevents overselling by validating available stock

### Invoice Workflow
1. **Draft**: Initial state, allows modifications, stock is reserved
2. **Issued**: Invoice is finalized with official number, stock is committed
3. **Paid**: Invoice is marked as paid with payment date
4. **Cancelled**: Invoice is voided, stock is recovered

### PDF Generation
- Professional invoice layout with company branding
- Automatic calculation of totals, taxes, and discounts
- Support for multiple line items with detailed breakdown

## Development

### Running Tests
```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests
cd frontend
npm test
```

### Code Formatting
```bash
# Frontend linting
cd frontend
npm run lint
```

## Deployment

### Backend Deployment
1. Set `DJANGO_DEBUG=False` in production
2. Configure proper `DJANGO_ALLOWED_HOSTS`
3. Set up production database
4. Collect static files: `python manage.py collectstatic`
5. Use a production WSGI server like Gunicorn

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or any static hosting
3. Configure environment variables in your hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see the [LICENSE](LICENSE.md) file for details.

## Roadmap

This MVP includes the core functionality for inventory and billing management. Future releases will include:

- **Real-time Dashboard**: Live metrics and notifications
- **Advanced Reporting**: Detailed sales and inventory reports
- **Multi-warehouse Support**: Manage inventory across multiple locations
- **Barcode Scanning**: Mobile barcode scanning for inventory management
- **Customer Portal**: Self-service portal for customers to view invoices
- **Integration APIs**: Connect with external accounting and e-commerce platforms
- **Mobile App**: Native mobile application for on-the-go management

## Support

For questions or support, please open an issue in the repository or contact the development team. 