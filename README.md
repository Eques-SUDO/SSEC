# SSEC — Système de suivi d'entreprise commerciale

Foundation scaffold for milestones M1 (Authentication) and M2 (Interactive Dashboard).

## Layout

```
SSEC/
├── backend/                 PHP REST API + MySQL + JWT
│   ├── api/auth/login.php   POST login → JWT
│   ├── config/              DB + app config
│   ├── helpers/             JWT, HTTP/CORS, auth middleware
│   ├── sql/schema.sql       MySQL DDL (employee, client, commande, …)
│   └── .env.example
└── frontend/                React (Vite) + react-router-dom + Chart.js
    ├── src/router/          Route table + role-based ProtectedRoute
    ├── src/pages/           Login + Dashboards (Direction/Employé/Admin IT)
    ├── src/components/      DashboardLayout, Sidebar, KPI/Chart placeholders
    ├── src/context/         AuthContext (JWT in localStorage)
    └── src/api/client.js    fetch wrapper, attaches Bearer token
```

## Backend setup (PHP 8.1+, MySQL 8+)

```bash
# 1. Create the schema
mysql -u root -p < backend/sql/schema.sql

# 2. Configure env
cp backend/.env.example backend/.env
# edit DB_*, set a strong JWT_SECRET, set FRONTEND_ORIGIN

# 3. Serve (built-in dev server)
php -S localhost:8000 -t backend
```

Seed an admin (passwords are stored with `password_hash`):

```sql
INSERT INTO employee (nom, prenom, email, password, role)
VALUES ('Admin', 'Root', 'admin@ssec.local',
        '$2y$10$REPLACE_WITH_password_hash_OUTPUT', 'admin_it');
```

Generate the hash quickly: `php -r "echo password_hash('your_pwd', PASSWORD_BCRYPT);"`

## Frontend setup (Node 18+)

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173, /api proxied to :8000
```

## Roles → routes

| Role       | Landing path | Sidebar links                                |
|------------|-------------|----------------------------------------------|
| `direction`| `/direction`| Vue d'ensemble · Performance · Employés      |
| `employe`  | `/employe`  | Mes tâches · Commandes · Clients             |
| `admin_it` | `/admin`    | Vue système · Utilisateurs · Journaux        |

`ProtectedRoute` redirects unauthenticated users to `/login` and unauthorized
roles to `/`.

## Auth flow

1. `POST /api/auth/login.php` `{ email, password }` → `{ token, user }`
2. Frontend stores `{token, user}` in `localStorage` via `AuthContext`
3. `apiFetch` attaches `Authorization: Bearer <token>` on subsequent calls
4. Server-side endpoints call `requireAuth($cfg, ['direction'])` to enforce roles

## Next steps (per the plan, S4 → S7)

- Add `/api/employees/*` CRUD (Admin IT)
- Add `/api/dashboard/*` aggregation endpoints (Direction KPIs)
- Wire `react-chartjs-2` into `ChartPlaceholder` slots
- SendGrid integration for security alerts (M3)
- Replace hand-rolled JWT helper with `firebase/php-jwt` via Composer if more
  algorithms / refresh tokens are needed
