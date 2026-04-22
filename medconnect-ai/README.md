# MedConnect AI

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white)

A full-stack medical appointment booking platform with AI-powered symptom analysis. Patients can browse verified doctors, book appointments, and get instant AI-generated health guidance. Doctors can manage their profile and schedule.

---

## Features

- **Patient**: Register, browse doctors by specialization, book appointments, track status (pending → confirmed → completed), cancel bookings
- **Doctor**: Register, create profile, manage schedule, confirm/complete/cancel appointments
- **AI Symptom Checker**: GPT-3.5-powered symptom analysis — returns possible conditions, recommended specialist, urgency level, and advice
- **JWT Auth**: Secure token-based authentication with role-based access (patient / doctor)
- **Admin Utility**: `/api/admin/approve/:id` endpoint to approve doctor profiles (demo use)
- **Responsive UI**: Clean, clinical design with TailwindCSS — works on mobile and desktop

---

## Tech Stack

| Layer     | Technology                               |
|-----------|------------------------------------------|
| Frontend  | React 18, Vite, React Router v6, Axios   |
| Styling   | TailwindCSS 3                            |
| Backend   | Node.js, Express 4, Sequelize ORM        |
| Database  | PostgreSQL                               |
| Auth      | JWT + bcryptjs                           |
| AI        | OpenAI API (GPT-3.5-turbo)               |
| Deploy    | Frontend → Vercel, Backend → Render      |

---

## Project Structure

```
medconnect-ai/
├── client/                    ← React frontend (Vite)
│   └── src/
│       ├── api/axios.js
│       ├── context/AuthContext.jsx
│       ├── components/
│       └── pages/
└── server/                    ← Node.js backend
    └── src/
        ├── config/
        ├── controllers/
        ├── middleware/
        ├── migrations/
        ├── models/
        ├── routes/
        └── utils/
```

---

## Setup Instructions

### Prerequisites

- Node.js ≥ 18
- PostgreSQL running locally (or a remote connection string)
- An OpenAI API key (for symptom checker)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/medconnect-ai.git
cd medconnect-ai
```

### 2. Backend setup

```bash
cd server
cp .env.example .env
# Fill in .env with your DB credentials, JWT_SECRET, and OPENAI_API_KEY
npm install
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npm run dev
```

### 3. Frontend setup

```bash
cd client
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api (or your deployed backend URL)
npm install
npm run dev
```

### 4. Approve a doctor (demo)

After a doctor registers and creates their profile, approve them via:

```bash
POST http://localhost:5000/api/admin/approve/:doctorId
```

Or browse all unapproved doctors at:

```bash
GET http://localhost:5000/api/admin/doctors
```

---

## Environment Variables

### `server/.env`

| Variable         | Description                        |
|------------------|------------------------------------|
| `PORT`           | Server port (default: 5000)        |
| `NODE_ENV`       | `development` or `production`      |
| `DATABASE_URL`   | Full Postgres connection string (recommended for Render/Neon) |
| `DB_HOST`        | PostgreSQL host                    |
| `DB_PORT`        | PostgreSQL port (default: 5432)    |
| `DB_USER`        | PostgreSQL username                |
| `DB_PASSWORD`    | PostgreSQL password                |
| `DB_NAME`        | Database name                      |
| `JWT_SECRET`     | Secret key for JWT signing         |
| `OPENAI_API_KEY` | OpenAI API key                     |
| `CLIENT_URL`     | Frontend URL (for CORS)            |

### `client/.env`

| Variable        | Description                        |
|-----------------|------------------------------------|
| `VITE_API_URL`  | Backend API base URL               |

---

## API Routes

| Method | Path                                | Auth     | Description                       |
|--------|-------------------------------------|----------|-----------------------------------|
| POST   | `/api/auth/register`                | Public   | Register patient or doctor        |
| POST   | `/api/auth/login`                   | Public   | Login, returns JWT                |
| GET    | `/api/doctors`                      | JWT      | List approved doctors             |
| GET    | `/api/doctors/:id`                  | JWT      | Doctor details                    |
| POST   | `/api/doctors/profile`              | JWT      | Create doctor profile             |
| POST   | `/api/appointments/book`            | JWT      | Patient books appointment         |
| GET    | `/api/appointments/my`              | JWT      | Patient's appointments            |
| GET    | `/api/appointments/doctor/schedule` | JWT      | Doctor's schedule                 |
| PATCH  | `/api/appointments/status/:id`      | JWT      | Doctor updates status             |
| PATCH  | `/api/appointments/cancel/:id`      | JWT      | Patient cancels appointment       |
| POST   | `/api/ai/symptom-check`             | JWT      | AI symptom analysis               |
| POST   | `/api/admin/approve/:id`            | None     | Approve doctor (demo only)        |

---

## Screenshots

> _Screenshots placeholder — add your own after running the app._

---

## Live Demo

> _Add deployed links here after deploying to Vercel (client) and Render (server)._

- **Frontend**: https://medconnect-ai.vercel.app
- **Backend**: https://medconnect-ai.onrender.com

---

## Deployment

### Backend → Render

1. Create a new Web Service on Render, point to `server/`
2. Set build command: `npm install && npx sequelize-cli db:migrate`
3. Set start command: `npm start`
4. Add all environment variables from `server/.env.example`
5. Prefer setting `DATABASE_URL` (Neon/Supabase/etc). In production, SSL is enabled automatically by the backend config.

### Frontend → Vercel

1. Import the repo on Vercel, set root directory to `client/`
2. Add `VITE_API_URL` environment variable pointing to your Render backend URL
3. Deploy

---

## Author

Built by **Piyush Agnihotri** · [GitHub](https://github.com/your-username)
