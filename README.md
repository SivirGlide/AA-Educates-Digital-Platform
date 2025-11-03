# AA Educates – Digital Learning Platform

## Prerequisites
- Python 3.11+ recommended (3.12+ works). Ensure `python3` and `pip` are available.
- Git

## 1) Clone and create a virtual environment
```bash
git clone <your-repo-url>
cd "AA-Educates-Digital-Platform"

# create venv (macOS/Linux)
python3 -m venv .venv
source .venv/bin/activate

# on Windows (PowerShell)
# python -m venv .venv
# .venv\\Scripts\\Activate.ps1
```

## 2) Install backend dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

Pinned versions (see `requirements.txt`):
- Django 5.2.7
- Django REST Framework 3.15.2
- drf-spectacular 0.27.2
- Environs 11.0.0

## 3) Environment variables (optional)
The project can run with defaults. If you prefer `.env`:
```env
# .env (optional)
DEBUG=True
SECRET_KEY=change-me
```
If you add `.env`, wire it in `backend/backend/settings.py` using `environs` (already installed).

## 4) Apply migrations and run the server
From the `backend/` directory:
```bash
cd backend
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver
```
Server runs at `http://127.0.0.1:8000/`.

## 5) Quick API smoke test
Use Swagger UI at `/api/docs/` or curl examples:
```bash
# Example: create a user (minimal) then list users
curl -sS -X POST http://127.0.0.1:8000/api/users/users/ \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@example.com","password":"Passw0rd!","first_name":"Alice","last_name":"A"}'

# List users
curl -sS http://127.0.0.1:8000/api/users/users/
```

## 6) Admin access (optional)
```bash
python3 manage.py createsuperuser
# Visit http://127.0.0.1:8000/admin/
```

## 7) Project structure (base-schema-0.3)
```
AA-Educates-Digital-Platform/
  backend/
    backend/                # Django project settings/urls/wsgi/asgi
    users/                  # Custom User + Profiles (Student/Parent/School/Corporate/Admin)
    projects/               # Projects and StudentProjectSubmission
    learning/               # Module, Resource, Workbook, WorkbookPurchase
    mentorship/             # MentorProfile, Session, SessionFeedback
    achievements/           # Skill, Badge, Certificate
    community/              # Post, Comment, GroupChat, Message
    analytics/              # ProgressTracker, EngagementLog, ImpactReport
    payments/               # PaymentTransaction, CRMContactLog
    manage.py
  client/                   # Frontend placeholder (currently empty)
```

## 8) URLs overview (prefixes with `/api/` prefix)
- API Documentation: `/api/docs/` (Swagger UI), `/api/redoc/` (ReDoc)
- Users: `/api/users/`
- Projects: `/api/projects/`
- Learning: `/api/learning/`
- Mentorship: `/api/mentorship/`
- Achievements: `/api/achievements/`
- Community: `/api/community/`
- Analytics: `/api/analytics/`
- Payments: `/api/payments/`

## 9) Common commands
```bash
# From repo root
source .venv/bin/activate
cd backend

# Run tests (placeholder)
python3 manage.py test

# Make new migrations
python3 manage.py makemigrations
python3 manage.py migrate
```

## 10) Branching workflow (reference)
- Feature work on branches (e.g., `main-models`, `venv-setup`).
- Keep branches separate unless intentionally merged via PR.

## 11) base-schema-0.3 changes
- Renamed Django project folder to `backend` (updated settings, urls, wsgi/asgi, manage.py).
- Using SQLite database (default Django database for development).
- Removed client folder contents (Next.js app removed).
- Removed django-cors-headers and djangorestframework-simplejwt (no CORS or JWT authentication on this branch).
- Introduced modular apps:
  - `users`: custom `User` with role enum and profile models.
  - `projects`: `Project`, `StudentProjectSubmission`.
  - `learning`: moved `Module`, `Resource`, `Workbook`, `WorkbookPurchase` out of `projects`.
  - `mentorship`: `MentorProfile`, `Session`, `SessionFeedback` (moved Skill/Badge/Certificate out).
  - `achievements`: new home for `Skill`, `Badge`, `Certificate`.
  - `community`: `Post`, `Comment`, `GroupChat`, `Message` with generic authors.
  - `analytics`: `ProgressTracker`, `EngagementLog`, `ImpactReport`.
  - `payments`: `PaymentTransaction`, `CRMContactLog`.
- DRF: each app exposes its own router under a top-level prefix (see URLs overview).

Migration note: if you changed `AUTH_USER_MODEL` or moved models between apps, you may need to reset the dev DB or write data migrations.
