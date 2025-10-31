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
- Environs 11.0.0

## 3) Environment variables (optional)
The project can run with defaults. If you prefer `.env`:
```env
# .env (optional)
DEBUG=True
SECRET_KEY=change-me
```
If you add `.env`, wire it in `project/project/settings.py` using `environs` (already installed).

## 4) Apply migrations and run the server
From the `project/` directory:
```bash
cd project
python3 manage.py makemigrations api
python3 manage.py migrate
python3 manage.py runserver
```
Server runs at `http://127.0.0.1:8000/`.

## 5) Quick API smoke test
Use the browsable API at `/` or curl examples:
```bash
# Create a course
curl -sS -X POST http://127.0.0.1:8000/courses/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Intro to AI","description":"Basics","is_published":true}'

# List courses
curl -sS http://127.0.0.1:8000/courses/
```

## 6) Admin access (optional)
```bash
python3 manage.py createsuperuser
# Visit http://127.0.0.1:8000/admin/
```

## 7) Project structure
```
AA-Educates-Digital-Platform/
  project/
    project/                # Django project settings/urls
    api/                    # App with models/serializers/views/urls
    manage.py
  client/                   # Frontend (Next.js) placeholder
```

## 8) Common commands
```bash
# From repo root
source .venv/bin/activate
cd project

# Run tests (placeholder)
python3 manage.py test

# Make new migrations
python3 manage.py makemigrations
python3 manage.py migrate
```

## 9) Branching workflow (reference)
- Feature work on branches (e.g., `main-models`, `venv-setup`).
- Keep branches separate unless intentionally merged via PR.

## 10) Next steps
- Switch to Django auth + JWT (SimpleJWT).
- Add custom actions: enroll, complete lesson, submit quiz.
- Scaffold Next.js frontend in `client/`.
