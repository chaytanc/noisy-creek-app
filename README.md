# Pacific Northwest Local Events Calendar

A full-stack event management application showcasing events in the Pacific Northwest region. Built with modern technologies, comprehensive input validation, and designed for optimal user experience across all devices.

## 🏗️ Architecture

- **Frontend**: Next.js 15 with React 19, TypeScript, and Tailwind CSS
- **Backend**: Django 5.2.4 with Django REST Framework 3.16.0
- **Database**: SQLite (development)
- **Security**: Input validation, HTML sanitization with nh3, XSS protection
- **Styling**: Tailwind CSS with custom Pacific Northwest theme
- **Testing**: Jest + React Testing Library (frontend), Django Test Framework (backend)

## ✨ Features

- **Event Browsing**: View events in a responsive card-based layout
- **Advanced Filtering**: Filter by category, date range, and upcoming events
- **Security Features**: Input validation, HTML sanitization, XSS protection
- **Mobile-First Design**: Fully responsive with touch-friendly interactions
- **Real-time Search**: Filter events without page reloads
- **Error Handling**: Graceful error boundaries with retry functionality
- **Performance**: Server-side rendering with optimized loading states
- **Comprehensive Testing**: Model validation, API security, and UI interaction tests

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn
- Git

### Complete Setup from Git Clone

```bash
# Clone the repository
git clone <repository-url>
cd noisy-creek-demo
```

### Backend Setup

```bash
# Navigate to backend directory
cd noisy-creek-backend

# Create and activate virtual environment (recommended)
python -m venv .venv

# Activate virtual environment
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
# .venv\Scripts\activate

# If you run code in VSCode or other IDEs, set the virtual environment now

# Install all dependencies from requirements.txt
# Note: ensure you have a version of python >= 3.10 when creating venv 
# or that you specify the path to python >= 3.10 when creating the venv (with  -p) if necessary
pip install -r requirements.txt

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Create a superuser (optional, for Django admin)
python manage.py createsuperuser

# Populate with sample data
python manage.py populate_events

# Start development server
python manage.py runserver
```

The Django API will be available at `http://localhost:8000`

**Admin Panel**: Access Django admin at `http://localhost:8000/admin/` (if you created a superuser)

### Frontend Setup

```bash
# Navigate to frontend directory (open new terminal or deactivate venv)
cd noisy-creek-app

# Install dependencies
npm install --legacy-peer-deps

# Create environment file (optional)
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
```

The Next.js app will be available at `http://localhost:3000`

### Quick Start Summary

1. **Backend**: `cd noisy-creek-backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && python manage.py migrate && python manage.py populate_events && python manage.py runserver`
2. **Frontend**: `cd noisy-creek-app && npm install && npm run dev`
3. **Open**: Navigate to `http://localhost:3000`

## 🧪 Testing

### Frontend Tests

```bash
cd noisy-creek-app

# Run all tests
npm test
# Note: If there are errors running this, try:
npm install --save-dev jest --legacy-peer-deps

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Backend Tests

```bash
cd noisy-creek-backend

# Ensure virtual environment is activated
source .venv/bin/activate  # or .venv\Scripts\activate on Windows

# Run all tests
python manage.py test

# Run specific test modules
python manage.py test eventlist.tests.test_models    # Model validation tests
python manage.py test eventlist.tests.test_api       # API security & functionality tests

# Run with verbose output
python manage.py test --verbosity=2

# Test specific security features
python manage.py test eventlist.tests.test_models.CategoryModelTest.test_category_html_sanitization
python manage.py test eventlist.tests.test_api.EventAPITest.test_malicious_category_input_sanitization
```

### Test Coverage
- **Model Validation**: Date validation, HTML sanitization, field constraints
- **Security Testing**: XSS prevention, SQL injection protection, input sanitization
- **API Functionality**: Filtering, pagination, error handling
- **Integration Testing**: End-to-end API workflows

## 📁 Project Structure

```
noisy-creek-demo/
├── noisy-creek-backend/          # Django REST API
│   ├── eventlist/                # Main Django app
│   │   ├── models.py            # Event, Category, Venue models
│   │   ├── views.py             # API views with filtering/pagination
│   │   ├── serializers.py       # DRF serializers
│   │   ├── tests/               # Backend test suite
│   │   └── management/commands/ # Data population scripts
│   └── eventsite/               # Django project settings
└── noisy-creek-app/             # Next.js frontend
    ├── app/                     # Next.js App Router
    │   ├── events/              # Events pages
    │   └── layout.tsx           # Root layout
    ├── components/              # React components
    │   ├── EventCard.tsx        # Individual event display
    │   ├── EventList.tsx        # Event grid with server-side data
    │   ├── FilterBar.tsx        # Search and filter controls
    │   ├── Pagination.tsx       # Mobile-friendly pagination
    │   └── __tests__/           # Frontend test suite
    └── types/                   # TypeScript definitions
```

## 🎯 API Endpoints

### Events API

- `GET /api/events/` - List events with pagination
  - Query params: `category`, `start_date`, `end_date`, `upcoming`, `page`
- `GET /api/events/{id}/` - Get single event details

### Example API Usage

```bash
# Get all events
curl http://localhost:8000/api/events/

# Filter by category
curl "http://localhost:8000/api/events/?category=music"

# Filter by date range
curl "http://localhost:8000/api/events/?start_date=2024-07-01&end_date=2024-07-31"

# Get upcoming events only
curl "http://localhost:8000/api/events/?upcoming=true"
```

## 🎨 Design Features

### Mobile-First Responsive Design
- **Touch-friendly**: 44px minimum touch targets
- **Adaptive layouts**: Single column on mobile, multi-column on desktop
- **Smart navigation**: Simplified pagination on mobile
- **Optimized performance**: Disabled expensive animations on mobile

### Error Handling
- **Error boundaries**: Graceful error recovery with retry options
- **Loading states**: Skeleton screens during data fetching
- **Network resilience**: Proper error messages for API failures

### Testing Coverage
- **Frontend**: Component unit tests, user interaction tests
- **Backend**: Model validation, API endpoint tests, filtering logic
- **Integration**: End-to-end API functionality

### Debug Features
Set `NEXT_PUBLIC_DEBUG_MODE=true` in `.env.local` to enable:
- **Performance timer**: Shows page load times
- **Error test button**: Test error boundary functionality
- **Enhanced error details**: Stack traces in development

## 🔧 Configuration

### Environment Variables

Create `.env.local` in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_DEBUG_MODE=false
```

## 🔒 Security & Validation Features

### Input Validation & Sanitization
- **HTML Sanitization**: Uses `nh3` (modern replacement for deprecated `bleach`) to sanitize user input
- **XSS Protection**: Script tags and dangerous HTML are completely removed
- **Field Validation**: Comprehensive validation for all model fields with proper error handling
- **API Input Sanitization**: Query parameters are sanitized to prevent injection attacks
- **Safe HTML**: Allows specific safe HTML tags in description fields (`<p>`, `<strong>`, `<em>`, etc.)

### Model Validation
- **Date Validation**: Ensures end dates are after start dates, prevents events too far in the past
- **Length Validation**: Enforces minimum/maximum lengths for text fields
- **Uniqueness Constraints**: Prevents duplicate category names
- **Positive Integers**: Validates venue capacity as positive numbers

### Dependencies
```
Django==5.2.4
djangorestframework==3.16.0
django-cors-headers==4.6.0
nh3==0.2.18              # Modern HTML sanitizer (replaces deprecated bleach)
python-dateutil==2.9.0   # Robust date parsing for API filters
```

## 🗃️ Database Models

### Core Models
- **Event**: Core event model with title, dates, location, category
  - Includes comprehensive validation and HTML sanitization
  - Enforces business rules (end date after start date, etc.)
- **Category**: Event categorization (Music, Food & Drink, Outdoor, etc.)
  - Unique constraint on names, HTML sanitization
- **Venue**: Optional venue information with capacity
  - Positive integer validation for capacity

### Future Scalability
- **EventPost**: *Currently unused in UI but included for future development*
  - Designed for additional event-related content/blog posts
  - Supports rich HTML content with sanitization
  - One-to-many relationship with Events
  - Could be used for event updates, detailed descriptions, or community posts
  - Ready for implementation when content management features are needed

## 📱 Browser Support

- **Modern browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile devices**: iOS Safari, Chrome Mobile, Samsung Internet
- **Minimum viewport**: 320px width (iPhone SE support)
---
