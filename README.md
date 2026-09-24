# 🎓 Smart Campus Hub

A professional, full-stack MERN application for managing campus activities, resources, and communications.

![Smart Campus Hub](https://img.shields.io/badge/MERN-Stack-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

## 🌟 Features

- **Authentication** — JWT-based login/register with role-based access (Student, Faculty, Admin)
- **Dashboard** — Personalized stats, charts, quick actions, recent activity
- **Announcements** — Pinned, categorized announcements with views tracking
- **Events** — Browse, register for campus events with real-time seat counts
- **Courses** — Course catalog, enrollment, materials, schedule
- **Complaints** — Submit, track, and resolve campus complaints
- **Resource Booking** — Book classrooms, labs, auditoriums by time slot
- **Profile** — Manage your campus profile and settings

## 🛠️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS v3   |
| Routing   | React Router v6                     |
| Charts    | Recharts                            |
| Icons     | Lucide React                        |
| Backend   | Node.js + Express.js                |
| Database  | MongoDB + Mongoose                  |
| Auth      | JWT + bcryptjs                      |

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))

### 1. Clone and Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

```bash
# Copy the example env file
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI and JWT secret
```

### 3. Seed Demo Data

```bash
cd server
node seed.js
```

This creates demo accounts:
| Role    | Email                 | Password   |
|---------|-----------------------|------------|
| Admin   | admin@campus.edu      | admin123   |
| Faculty | faculty@campus.edu    | faculty123 |
| Student | student@campus.edu    | student123 |

### 4. Run the Application

```bash
# Terminal 1 — Start backend (port 5000)
cd server
npm run dev

# Terminal 2 — Start frontend (port 5173)
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

## 📁 Project Structure

```
smart-campus-hub/
├── server/                    # Express.js API
│   ├── config/db.js           # MongoDB connection
│   ├── middleware/            # Auth, error handler
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API endpoints
│   ├── seed.js                # Demo data seeder
│   └── server.js              # Entry point
│
└── client/                    # React + Vite
    ├── src/
    │   ├── components/
    │   │   ├── layout/        # Sidebar, Header, Layout
    │   │   └── ui/            # Reusable UI components
    │   ├── context/           # Auth context
    │   ├── pages/             # All page components
    │   └── utils/api.js       # Axios instance
    └── vite.config.js
```

## 🔌 API Endpoints

| Method | Endpoint                    | Description              | Access     |
|--------|-----------------------------|--------------------------|------------|
| POST   | /api/auth/register          | Register user            | Public     |
| POST   | /api/auth/login             | Login                    | Public     |
| GET    | /api/auth/me                | Get current user         | Protected  |
| GET    | /api/announcements          | List announcements       | Protected  |
| POST   | /api/announcements          | Create announcement      | Faculty+   |
| GET    | /api/events                 | List events              | Protected  |
| POST   | /api/events/:id/register    | Register for event       | Protected  |
| GET    | /api/courses                | List courses             | Protected  |
| POST   | /api/courses/:id/enroll     | Enroll in course         | Student    |
| GET    | /api/complaints             | List complaints          | Protected  |
| POST   | /api/complaints             | Submit complaint         | Protected  |
| GET    | /api/resources              | List resources           | Protected  |
| POST   | /api/resources/:id/book     | Book a resource          | Protected  |
| GET    | /api/dashboard/stats        | Dashboard statistics     | Protected  |

## 📄 License

MIT — feel free to use and modify for your campus!
