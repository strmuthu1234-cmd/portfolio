# Muthupandi Developer Control Center

A full-stack developer portfolio for **Muthupandi P — Python Full Stack Developer**, built as a
real application instead of a static page: React + Tailwind on the front, Django REST Framework +
PostgreSQL behind it, JWT-protected admin dashboard, a live Employee CRUD API demo and Swagger docs.

```
User → React.js → REST API → Django REST Framework → PostgreSQL → AWS S3
Login → JWT Access Token → Protected Admin APIs
```

## Tech stack

| Layer    | Tools |
|----------|-------|
| Frontend | React 18, Vite, Tailwind CSS, Axios, React Router |
| Backend  | Python, Django 5, Django REST Framework, Simple JWT, django-filter, drf-spectacular |
| Data     | PostgreSQL (SQLite optional for a zero-setup run), AWS S3 for uploaded images |

## Folder structure

```
muthupandi-portfolio/
├── README.md
├── .gitignore
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── config/        settings, urls, pagination, permissions, error handler, API tests
│   ├── accounts/      JWT login / refresh / me
│   ├── portfolio/     Skill, Experience, MediaAsset  (+ `seed_data` command)
│   ├── projects/      Project
│   ├── contact/       ContactMessage
│   └── employees/     Employee (API demo)
└── frontend/
    ├── package.json, vite.config.js, tailwind.config.js, .env.example
    ├── public/        favicon, Muthupandi_P_Resume.pdf (placeholder – replace it)
    └── src/
        ├── components/   UI building blocks (+ sections/, admin/)
        ├── pages/        Home, About, Skills, Experience, Projects, ProjectDetail,
        │                 ApiDemo, Contact, Login, AdminDashboard
        ├── layouts/      PublicLayout
        ├── context/      AuthContext (JWT session)
        ├── hooks/        useFetch, useTypingLines, useReveal
        ├── services/     api.js (Axios + token refresh), resources.js (endpoints)
        ├── utils/        tokenStore, errors, validators, format
        ├── data/         site constants
        └── assets/
```

## Quick start (local)

### 1. Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate      macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # Windows: copy .env.example .env
```

Edit `.env`. For a **zero-setup run** set `DB_ENGINE=sqlite`; for PostgreSQL see below.

```bash
python manage.py migrate
python manage.py seed_data    # sample projects, skills, experience, employees + admin user
python manage.py runserver    # http://localhost:8000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env          # VITE_API_BASE_URL=http://localhost:8000/api
npm install
npm run dev                   # http://localhost:5173
```

Admin login: `/login` with the `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD` from your `.env`
(defaults `admin` / `ChangeMe123!` — **change them**), then open `/admin-dashboard`.

## PostgreSQL setup

```sql
CREATE DATABASE portfolio_db;
-- or: CREATE USER portfolio WITH PASSWORD 'secret'; GRANT ALL ON DATABASE portfolio_db TO portfolio;
```

Then in `backend/.env`:

```
DB_ENGINE=postgres
DB_NAME=portfolio_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
```

Run `python manage.py migrate` (migrations are already committed).

## JWT setup

- `POST /api/auth/login/` with `{"username","password"}` → `{access, refresh, user}` (staff accounts only).
- `POST /api/auth/refresh/` with `{"refresh"}` → new `access` (refresh tokens rotate).
- Lifetimes: `JWT_ACCESS_MINUTES` (30) and `JWT_REFRESH_DAYS` (7).
- Create your own admin: `python manage.py createsuperuser`.

**Frontend token handling:** the access token is kept in memory only; the refresh token lives in
`sessionStorage`. Axios attaches `Authorization: Bearer …`, transparently refreshes on a 401 (one shared
refresh for concurrent requests), and a failed refresh logs the user out and redirects to `/login`.
`/admin-dashboard` is wrapped in `ProtectedRoute`. (For maximum hardening, move the refresh token to an
`HttpOnly` cookie served by the backend.)

## API reference

| Route | Methods | Access |
|-------|---------|--------|
| `/api/auth/login/`, `/api/auth/refresh/` | POST | public (throttled) |
| `/api/auth/me/` | GET | admin |
| `/api/projects/`, `/api/projects/<slug>/` | GET public; POST/PATCH/DELETE admin | `?featured=`, `?search=` |
| `/api/skills/` | GET public; write admin | `?category=` |
| `/api/experience/` | GET public; write admin | `?is_current=` |
| `/api/contact/` | POST public (throttled); list/PATCH/DELETE admin | `?is_read=` |
| `/api/employees/`, `/api/employees/<id>/` | GET, POST, PATCH, DELETE | public demo (see below) |
| `/api/media/` | GET, POST, DELETE | admin |

- Pagination: `?page=` and `?page_size=` (max 100) → `{count, next, previous, results}`.
- Errors are uniform: `{"error": {"status": 400, "message": "...", "details": {...}}}`.
- **Swagger UI:** <http://localhost:8000/api/docs/> · ReDoc: `/api/redoc/` · OpenAPI schema: `/api/schema/`.
- The Employee demo is open so visitors can try it. Set `EMPLOYEE_DEMO_PUBLIC=False` to require an admin JWT.

### Sample requests

```bash
curl -X POST http://localhost:8000/api/auth/login/ -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"ChangeMe123!"}'

curl -X POST http://localhost:8000/api/employees/ -H "Content-Type: application/json" \
  -d '{"name":"Asha K","email":"asha@example.com","department":"HR","designation":"Recruiter","status":"active","join_date":"2025-07-01"}'

curl -X POST http://localhost:8000/api/projects/ -H "Authorization: Bearer <access>" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Project","short_description":"...","tech_stack":["Django","React.js"]}'
```

## AWS S3 for images

Set in `backend/.env`:

```
USE_S3=True
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_STORAGE_BUCKET_NAME=your-bucket
AWS_S3_REGION_NAME=ap-south-1
```

Project thumbnails and admin media uploads then go to S3 via `django-storages`. With `USE_S3=False`
they are stored in `backend/media/` and served by Django in debug mode. The bucket needs public-read
objects (or a CloudFront/pre-signed setup).

## Contact notifications (optional)

Messages are always saved to PostgreSQL. To also get an email: `CONTACT_NOTIFY_ENABLED=True`,
`CONTACT_NOTIFY_TO=you@example.com`, and configure `EMAIL_*` (default backend prints to the console).

## Tests

```bash
cd backend && python manage.py test
```

Covers public reads, admin-only writes, staff-only login, JWT refresh, contact flow, employee CRUD/validation
and Swagger availability.

## Deployment

**Backend (Render / Railway / EC2 …)**
1. Provision PostgreSQL; set all `backend/.env` values as environment variables.
2. `DJANGO_DEBUG=False`, a long random `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS=api.yourdomain.com`.
3. `CORS_ALLOWED_ORIGINS=https://yourdomain.com` and `CSRF_TRUSTED_ORIGINS=https://api.yourdomain.com`.
4. Build: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
5. Start: `gunicorn config.wsgi:application`  (WhiteNoise serves static files).
6. Run `python manage.py seed_data` once, then change the admin password. Use `USE_S3=True` in production —
   local `media/` is not persisted on most hosts.

**Frontend (Vercel / Netlify / S3+CloudFront)**
1. Set `VITE_API_BASE_URL=https://api.yourdomain.com/api` (plus `VITE_GITHUB_URL`, `VITE_LINKEDIN_URL`).
2. `npm run build` → deploy `frontend/dist`.
3. Add an SPA fallback so every path serves `index.html` (Vercel: rewrite `/(.*)` → `/`; Netlify: `/* /index.html 200`).

## Customising

- Replace `frontend/public/Muthupandi_P_Resume.pdf` with the real resume (same filename).
- Set your real GitHub / LinkedIn URLs in `frontend/.env`.
- All portfolio content (projects, skills, experience, uploads) is editable from `/admin-dashboard`.
- The 360° project page has a placeholder slot where a GLB model can be added later.
- Theme colours live in `frontend/tailwind.config.js`.
#   p o r t f o l i o  
 