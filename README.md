# Pacific Northwest Local Events Calendar

A full-stack event management application showcasing events in the Pacific Northwest region. Built with modern technologies and designed for optimal user experience across all devices.

## 🏗️ Architecture

- **Frontend**: Next.js 15 with React 19, TypeScript, and Tailwind CSS
- **Backend**: Django 5.2.4 with Django REST Framework 3.16.0
- **Database**: SQLite (development)
- **Styling**: Tailwind CSS with custom Pacific Northwest theme
- **Testing**: Jest + React Testing Library (frontend), Django Test Framework (backend)

## ✨ Features

- **Event Browsing**: View events in a responsive card-based layout
- **Advanced Filtering**: Filter by category, date range, and upcoming events
- **Mobile-First Design**: Fully responsive with touch-friendly interactions
- **Real-time Search**: Filter events without page reloads
- **Error Handling**: Graceful error boundaries with retry functionality
- **Performance**: Server-side rendering with optimized loading states

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd noisy-creek-backend

# Install dependencies (using virtual environment recommended)
pip install django djangorestframework django-cors-headers

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Populate with sample data
python manage.py populate_events

# Start development server
python manage.py runserver
```

The Django API will be available at `http://localhost:8000`

### Frontend Setup

```bash
cd noisy-creek-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The Next.js app will be available at `http://localhost:3000`

## 🧪 Testing

### Frontend Tests

```bash
cd noisy-creek-app

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Backend Tests

```bash
cd noisy-creek-backend

# Run all tests
python manage.py test

# Run specific test modules
python manage.py test eventlist.tests.test_models
python manage.py test eventlist.tests.test_api

# Run with verbose output
python manage.py test --verbosity=2
```

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

### Database Models

- **Event**: Core event model with title, dates, location, category
- **Category**: Event categorization (Music, Food & Drink, Outdoor, etc.)
- **Venue**: Optional venue information with capacity
- **EventPost**: Optional additional content for posts about events

## 📱 Browser Support

- **Modern browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile devices**: iOS Safari, Chrome Mobile, Samsung Internet
- **Minimum viewport**: 320px width (iPhone SE support)
---