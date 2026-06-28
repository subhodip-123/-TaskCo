# Tasker — Production-Ready MERN TaskCo

A full-stack, production-ready To-Do List Web Application built with the MERN stack (MongoDB, Express, React, Node), featuring JWT authentication, real-time updates via Socket.io, a polished Tailwind UI with dark mode, drag-and-drop sorting, analytics charts, CSV/PDF export, and PWA support.

---

## Tech stack

**Frontend**
- React 18 + Vite
- React Router DOM 6
- Tailwind CSS 3.4
- Axios
- Chart.js + react-chartjs-2
- Socket.io-client
- react-hot-toast (notifications)
- react-icons
- jsPDF + jspdf-autotable (PDF export)
- vite-plugin-pwa (PWA)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT auth (jsonwebtoken)
- bcryptjs password hashing
- express-validator
- Helmet, CORS, Morgan, express-rate-limit
- Socket.io (real-time)

---

## Folder structure

```
todo-app/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── task.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── task.routes.js
│   ├── services/
│   │   └── email.service.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── validators/
│   │   ├── auth.validator.js
│   │   └── task.validator.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/favicon.svg
    ├── src/
    │   ├── assets/index.css
    │   ├── components/
    │   │   ├── common/ (Sidebar, Navbar, Modal, ConfirmDialog,
    │   │   │            Spinner, Skeleton, EmptyState)
    │   │   ├── tasks/ (TaskCard, TaskForm, TaskFilters, Pagination)
    │   │   └── dashboard/ (StatCard, ProgressBar, PriorityChart)
    │   ├── context/ (AuthContext, ThemeContext)
    │   ├── hooks/useDebounce.js
    │   ├── layouts/ (MainLayout, AuthLayout)
    │   ├── pages/ (Login, Register, Dashboard, TasksPage,
    │   │           CreateTask, EditTask, Profile, NotFound)
    │   ├── routes/ (AppRoutes, ProtectedRoute)
    │   ├── services/ (api, auth.service, task.service, socket)
    │   ├── utils/ (format, exportTasks)
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

---

## Features

### Authentication
- Register, login, JWT-protected routes
- bcrypt password hashing (10 salt rounds)
- Token stored in localStorage, sent via Axios interceptor
- Automatic logout on 401 responses
- Rate-limited auth endpoints (50 requests / 15 min)

### Tasks
- Create / edit / delete / mark complete
- Priority (low / medium / high), due date, category/tags
- Search (debounced) across title, description, and category
- Filter by status (pending / completed) and priority
- Sort by created date, due date, priority, or title
- Pagination
- Drag-and-drop reordering (HTML5 DnD; persists order to the server)

### Dashboard
- Total / completed / pending counters
- Progress bar with completion %
- Today's tasks list
- Recent activity (last 5 updated)
- Doughnut chart: tasks by priority

### UI / UX
- Clean Tailwind design, Inter typography
- Sidebar nav + top navbar layout
- Dark / light mode toggle (persisted)
- Toast notifications (react-hot-toast)
- Confirmation modal before delete
- Skeleton loaders and spinner
- Empty-state illustration (inline SVG)
- Fully responsive — mobile sidebar drawer included

### Extras
- Real-time updates via Socket.io (multi-tab sync)
- Export tasks to CSV and PDF
- PWA support (vite-plugin-pwa) — installable, offline-ready shell
- Email reminder service stub (drop in nodemailer)

---

## API endpoints

### Auth (`/api/auth`)
| Method | Path        | Auth | Description                |
| ------ | ----------- | ---- | -------------------------- |
| POST   | `/register` | No   | Register a new user        |
| POST   | `/login`    | No   | Login, returns JWT         |
| GET    | `/profile`  | Yes  | Get current user profile   |
| PUT    | `/profile`  | Yes  | Update profile / password  |

### Tasks (`/api/tasks`) — all routes require auth
| Method | Path             | Description                                        |
| ------ | ---------------- | -------------------------------------------------- |
| GET    | `/`              | List tasks (`search, status, priority, page, ...`) |
| GET    | `/stats`         | Dashboard stats                                    |
| POST   | `/`              | Create task                                        |
| PUT    | `/:id`           | Update task                                        |
| DELETE | `/:id`           | Delete task                                        |
| PATCH  | `/:id/status`    | Toggle / set completion                            |
| PATCH  | `/reorder`       | Bulk reorder for drag-and-drop                     |

### Database schema

**User**: `name`, `email` (unique), `password` (hashed), `avatar`, `timestamps`
**Task**: `title`, `description`, `completed`, `priority`, `dueDate`, `category`, `tags[]`, `order`, `userId` (ref User), `timestamps`

Indexes: `userId + completed + priority`, plus text index on title/description/category.

---

## Installation

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)
- npm or pnpm

### 1. Clone and install

```bash
# from the project root
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment

```bash
# backend
cd backend
cp .env.example .env
# then edit .env to set MONGO_URI and JWT_SECRET
```

Backend `.env`:
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/todo_app
JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

```bash
# frontend
cd ../frontend
cp .env.example .env
```

Frontend `.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Run dev servers

In two terminals:

```bash
# Terminal 1 — backend (http://localhost:5000)
cd backend
npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd frontend
npm run dev
```

Open http://localhost:5173 in your browser. Register an account and start adding tasks.

---

## Production build

```bash
# backend (already production-ready)
cd backend
NODE_ENV=production npm start

# frontend — builds to ./dist
cd frontend
npm run build
npm run preview   # to test locally
```

Serve the frontend `dist/` from any static host (Nginx, Vercel, Netlify, Cloudflare Pages, S3+CloudFront) and point it at your deployed API.

---

## Deployment guide

### Backend — Render / Railway / Fly.io / Heroku-like
1. Push the `backend/` folder to a Git repo (or use a monorepo with a build root).
2. Set environment variables (`MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, `NODE_ENV=production`).
3. Build command: `npm install`. Start command: `npm start`.
4. Expose port — most platforms inject `PORT` automatically; `server.js` honors it.

### MongoDB — Atlas
1. Create a free cluster on https://www.mongodb.com/atlas
2. Whitelist your server's IP (or `0.0.0.0/0` for testing)
3. Copy the connection string into `MONGO_URI`

### Frontend — Vercel / Netlify
1. Connect the `frontend/` directory
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add env vars `VITE_API_URL` and `VITE_SOCKET_URL` pointing at your deployed backend

### Docker (optional)
A `Dockerfile` per service can be added — both apps are stateless except for MongoDB.

---

## Security checklist

- Passwords are hashed with bcrypt before storage; `password` field is `select: false`.
- JWT signed with a server-side secret; expires (default 7 days).
- Helmet sets standard security headers.
- CORS restricted to `CLIENT_ORIGIN`.
- express-rate-limit caps auth endpoint abuse.
- Input validation via express-validator on register/login/task creation.
- Centralised error middleware avoids leaking stack traces in production.

---

## Scripts cheat sheet

Backend (`backend/package.json`)
- `npm run dev` — start with nodemon
- `npm start` — start in production mode

Frontend (`frontend/package.json`)
- `npm run dev` — Vite dev server with `/api` proxy to `http://localhost:5000`
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the built app

---

## License

MIT
