# Progressor - Self Development Tracker

A full-stack habit tracking application built with Django REST Framework and Next.js.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Habit Management**: Create, edit, and track habits with categories
- **Progress Tracking**: Mark daily progress and view streaks
- **Statistics Dashboard**: View completion rates and analytics
- **Responsive Design**: Clean UI with light/dark theme support

## Tech Stack

### Backend
- Python 3.13+
- Django 5.2.7
- Django REST Framework
- JWT Authentication (djangorestframework-simplejwt)
- SQLite (development) / PostgreSQL (production)
- CORS support

### Frontend
- Next.js 16+
- React 19+
- Axios for API calls
- Custom CSS with CSS variables for theming
- Responsive design

## Project Structure

```
limb-project/
├── backend/                 # Django REST API
│   ├── progressor/         # Main Django project
│   ├── habits/             # Habits app (models, views, serializers)
│   ├── accounts/           # Authentication app
│   ├── requirements.txt    # Python dependencies
│   └── db.sqlite3         # SQLite database
└── frontend/               # Next.js application
    ├── src/
    │   ├── app/           # Next.js app router pages
    │   ├── components/    # React components
    │   ├── lib/          # Utilities (API client, auth)
    │   └── styles/       # SCSS styles
    └── package.json       # Node dependencies
```

## Quick Start

### Prerequisites
- Python 3.13+
- Node.js 22+
- npm 10+

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\Activate.ps1  # Windows
   # or
   source venv/bin/activate     # Linux/Mac
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Create superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```

6. Start development server:
   ```bash
   python manage.py runserver
   ```

Backend will be available at http://localhost:8000

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

Frontend will be available at http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Refresh JWT token

### Categories
- `GET /api/categories/` - List user categories
- `POST /api/categories/` - Create new category
- `GET /api/categories/{id}/` - Get category details
- `PUT /api/categories/{id}/` - Update category
- `DELETE /api/categories/{id}/` - Delete category

### Habits
- `GET /api/habits/` - List user habits
- `POST /api/habits/` - Create new habit
- `GET /api/habits/{id}/` - Get habit details
- `PUT /api/habits/{id}/` - Update habit
- `DELETE /api/habits/{id}/` - Delete habit (soft delete)

### Progress
- `GET /api/progress/` - List progress records
- `POST /api/progress/` - Create progress record
- `POST /api/progress/toggle/` - Toggle habit completion

### Statistics
- `GET /api/stats/` - Get user statistics
- 
## Development Notes

- Backend uses SQLite for development (easy setup)
- Frontend uses custom CSS instead of Tailwind
- JWT tokens are stored in localStorage
- CORS is configured for localhost:3000
- All API endpoints require authentication except auth endpoints

## Next Steps

This is an MVP version. Future enhancements could include:
- AI-powered habit suggestions
- Real-time updates with WebSockets
- Achievement system and badges
- Push notifications
- Mobile app
- Advanced analytics and reporting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
