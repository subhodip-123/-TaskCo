# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend (`/backend`)
```bash
npm run dev      # Start with nodemon (auto-restart on changes)
npm start        # Start in production mode
```

### Frontend (`/frontend`)
```bash
npm run dev      # Vite dev server at http://localhost:5173
npm run build    # Production build to dist/
npm run preview  # Preview the production build locally
```

There are no test or lint scripts configured. Both servers must run simultaneously — backend on port 5000, frontend on port 5173.

## Architecture

This is a full-stack to-do app: a Node.js/Express REST API backend with a React/Vite frontend.

### Backend

**Entry point:** `backend/server.js` — creates an Express app wrapped in an HTTP server (for Socket.io), applies the middleware stack, mounts routes, and calls `sequelize.sync()` on startup to auto-migrate the schema.

**Database:** SQL Server via Sequelize ORM (dialect: `mssql`, driver: Tedious). Connection config is in `backend/config/db.js`. Schema is code-first — models auto-sync on startup.

**Models:**
- `User` — hashes password in a Sequelize `beforeCreate`/`beforeUpdate` hook. `toJSON()` strips the password field. Has a `matchPassword()` instance method.
- `Task` — `toJSON()` renames `id` → `_id` and formats `dueDate` as an ISO string (the frontend expects `_id`). Has a composite index on `(userId, completed, priority)`.

**Request lifecycle:**
1. Rate-limiter (50 req/15 min on auth routes) → Helmet → CORS → body-parser
2. Route handler calls validator middleware (express-validator), then `protect` (JWT auth), then controller
3. `protect` middleware reads `Authorization: Bearer <token>`, verifies with `JWT_SECRET`, attaches the user to `req.user`
4. Errors bubble to `errorHandler` (maps Sequelize constraint/validation errors to 400; hides stack in production)

**Real-time:** After any task mutation (create/update/delete), the controller emits a Socket.io event (`task:created`, `task:updated`, `task:deleted`) to the user's personal room (`user:${userId}`). On login the client emits `join` with its userId to enter that room.

**Routes:**
- `POST /api/auth/register`, `POST /api/auth/login` — public
- `GET|PUT /api/auth/profile` — protected
- `GET /api/tasks` — list with search/filter/sort/pagination (page, limit, search, status, priority, sortBy)
- `GET /api/tasks/stats` — dashboard aggregates (total, completed, pending, progress %, by-priority counts, today's tasks, recent 5)
- `POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id` — CRUD
- `PATCH /api/tasks/:id/status` — toggle completed
- `PATCH /api/tasks/reorder` — bulk order update (drag-and-drop persistence); accepts `_id` or `id`

### Frontend

**Auth flow:** `AuthContext` stores the user and token in `localStorage`. An Axios request interceptor (in `services/api.js`) attaches the token as `Authorization: Bearer`. A response interceptor auto-clears auth and redirects to `/login` on any 401.

**Socket.io:** `services/socket.js` exports a `getSocket()` singleton. `AuthContext` connects the socket and emits `join` on login; disconnects on logout. Pages (`TasksPage`) listen for task events and call `fetchTasks()` to refresh.

**Service layer:** `services/task.service.js` and `services/auth.service.js` wrap all API calls. Components never call `axios` directly.

**Route protection:** `ProtectedRoute` checks `AuthContext` for a user; redirects to `/login` preserving the intended destination in `location.state.from`.

**Theme:** `ThemeContext` persists the theme in `localStorage` and toggles the `dark` class on `<html>`. Tailwind is configured with `darkMode: 'class'`.

**Layouts:**
- `AuthLayout` — centered card (split-screen branding panel on desktop); redirects to `/dashboard` if already authenticated
- `MainLayout` — fixed sidebar + sticky navbar + scrollable `<main>`

## Key Conventions

- The backend always returns `dueDate` as `"YYYY-MM-DD"`. Parsing it through `new Date()` shifts the day due to UTC. Use the `parseDateOnly` helper in `frontend/src/utils/format.js` or slice the string directly — never use `new Date(dueDateString)`.
- Task objects from the API use `_id` (not `id`) — the `Task.toJSON()` model method handles this rename.
- Tailwind opacity modifiers must use increments of 5 (e.g. `/10`, `/20`). Non-standard values like `/8` or `/15` cause a PostCSS build error.
- All form inputs in the frontend use icon-prefixed styling with `pl-10`. Keep inputs within the `.input` utility class and labels within `.label`.

## Environment Variables

**Backend (`backend/.env`):**
```
PORT=5000
NODE_ENV=development
DB_HOST=
DB_PORT=1433
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_ENCRYPT=false
DB_TRUST_CERT=true
JWT_SECRET=
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

**Frontend (create `frontend/.env`):**
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```
