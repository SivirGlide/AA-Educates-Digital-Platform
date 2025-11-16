# Authentication & Login Setup

## Overview

JWT (JSON Web Token) authentication has been implemented to enable secure user login and role-based access to the platform.

## What Was Implemented

### Backend (Django)

#### 1. JWT Package Installation
- **Package**: `djangorestframework-simplejwt==5.3.1`
- **Purpose**: Token-based authentication for stateless API security

#### 2. JWT Configuration (`backend/backend/settings.py`)
```python
# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'UPDATE_LAST_LOGIN': False,
}
```

#### 3. Authentication Endpoints (`backend/users/auth_views.py`)
- **POST `/api/users/auth/login/`** - User login
  - Accepts: `email`, `password`
  - Returns: `access` token, `refresh` token, `user` object (with `profile_id`)
  
- **POST `/api/users/auth/register/`** - User registration
  - Accepts: `email`, `password`, `username`, `first_name`, `last_name`, `role`
  - Returns: `access` token, `refresh` token, `user` object

- **POST `/api/users/auth/refresh/`** - Refresh access token
- **POST `/api/users/auth/verify/`** - Verify token validity

#### 4. DRF Configuration
- **Default Authentication**: JWT tokens
- **Default Permissions**: `AllowAny` (for development - allows unauthenticated CRUD)
- **Note**: For production, change to `IsAuthenticatedOrReadOnly` or role-based permissions

### Frontend (Next.js)

#### 1. Login Form (`client/pages/login.tsx`)
- Email and password input
- Connects to `/api/users/auth/login/`
- Stores tokens and user info in `localStorage`:
  - `access_token` - JWT access token
  - `refresh_token` - JWT refresh token
  - `user` - User object (JSON stringified)
  - `userId` - User ID
  - `userRole` - User role (STUDENT, CORPORATE_PARTNER, PARENT, ADMIN)
  - `profileId` - Profile ID (StudentProfile, CorporatePartnerProfile, etc.)

#### 2. Role-Based Redirects
After successful login, users are redirected based on their role:
- `STUDENT` → `/student/dashboard`
- `CORPORATE_PARTNER` → `/corporate/dashboard`
- `PARENT` → `/parent/dashboard`
- `ADMIN` → `/admin/dashboard`

#### 3. API Client (`client/lib/api.ts`)
- **Automatic Token Injection**: All API requests automatically include `Authorization: Bearer <token>` header
- **401 Handling**: Automatically redirects to login if token is invalid/expired
- **Login/Register**: Separate functions that don't require tokens

#### 4. Dynamic Dashboards
All dashboards now use authenticated user data:
- **Student Dashboard**: Uses `profileId` from localStorage (not hard-coded ID 1)
- **Corporate Dashboard**: Uses authenticated corporate partner's profile ID
- **Parent Dashboard**: Uses authenticated parent's profile ID

## How Authentication Works

### Login Flow
1. User enters email/password in login form
2. Frontend sends POST request to `/api/users/auth/login/`
3. Backend validates credentials
4. Backend generates JWT tokens (access + refresh)
5. Backend returns tokens + user info (including `profile_id`)
6. Frontend stores tokens in `localStorage`
7. Frontend redirects to appropriate dashboard

### API Request Flow
1. Frontend makes API request (e.g., `api.getStudent(profileId)`)
2. API client checks `localStorage` for `access_token`
3. If token exists, adds `Authorization: Bearer <token>` header
4. Backend receives request, validates token
5. Backend extracts user ID from token
6. Backend returns data (filtered by permissions if implemented)

### Token Expiration
- **Access Token**: Valid for 1 hour
- **Refresh Token**: Valid for 1 day
- **401 Response**: Frontend automatically redirects to login
- **Token Refresh**: Use `/api/users/auth/refresh/` endpoint with refresh token

## Current State

### ✅ Completed
- [x] JWT authentication backend setup
- [x] Login endpoint with profile ID lookup
- [x] Register endpoint
- [x] Token refresh/verify endpoints
- [x] Login form connected to backend
- [x] Role-based dashboard redirects
- [x] API client with automatic token injection
- [x] Dynamic dashboards (no hard-coded IDs)
- [x] Token storage in localStorage
- [x] 401 error handling (auto-redirect to login)

### 🔄 Development Settings
- **Permissions**: Currently set to `AllowAny` for easy testing/population
- **Production**: Should be changed to `IsAuthenticatedOrReadOnly` or role-based permissions

## Testing

### Test Login
1. Start Django server: `python manage.py runserver`
2. Start Next.js: `npm run dev` (in `client/` directory)
3. Go to `http://localhost:3000/login`
4. Use existing credentials:
   - Student: `robert@gmail.com`
   - Corporate: `joaodasilva@yahoo.co.uk`
   - Parent: `rowan@yahoo.co.uk`

### Test API with Token
1. Login via frontend to get token
2. Copy `access_token` from browser localStorage
3. Use in Swagger UI: Click "Authorize" → Enter `Bearer <token>`
4. Or use in curl:
   ```bash
   curl -H "Authorization: Bearer <token>" http://127.0.0.1:8000/api/projects/projects/
   ```

## Next Steps (Not Yet Implemented)

- [ ] Logout functionality (clear tokens)
- [ ] Protected routes (redirect if not logged in)
- [ ] Token refresh on frontend (before expiry)
- [ ] Role-based permissions on viewsets
- [ ] Password reset functionality
- [ ] Email verification

## Files Modified

### Backend
- `requirements.txt` - Added `djangorestframework-simplejwt`
- `backend/backend/settings.py` - JWT configuration, DRF settings
- `backend/users/auth_views.py` - Login/register views (new file)
- `backend/users/urls.py` - Auth endpoints routing

### Frontend
- `client/pages/login.tsx` - Login form with email/password
- `client/lib/api.ts` - Token injection, login/register functions
- `client/pages/student/dashboard.tsx` - Dynamic user data
- `client/pages/corporate/dashboard.tsx` - Dynamic user data
- `client/pages/parent/dashboard.tsx` - Dynamic user data

