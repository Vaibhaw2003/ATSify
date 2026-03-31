# ATSify — AI-Powered ATS Resume Analyzer 🚀

> Boost Your Resume ATS Score Instantly

ATSify is a full-stack SaaS web application that analyzes your resume against job descriptions using keyword matching and AI-powered suggestions.

![Stack](https://img.shields.io/badge/Frontend-Next.js-black?logo=next.js)
![Stack](https://img.shields.io/badge/Backend-Spring_Boot-6DB33F?logo=springboot)
![Stack](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)
![Stack](https://img.shields.io/badge/AI-OpenAI-412991?logo=openai)

---

## ✨ Features

- **JWT Authentication** — Secure signup, login, and protected routes
- **Resume Upload** — Drag-and-drop PDF/DOCX upload with Apache Tika text extraction
- **ATS Scoring** — Keyword matching algorithm with percentage score
- **Keyword Analysis** — See matched and missing keywords at a glance
- **AI Suggestions** — OpenAI-powered improvement recommendations (graceful fallback)
- **Score History** — Dashboard with analysis history and stats
- **Modern UI** — Dark theme SaaS design with glassmorphism and animations

---

## 🛠️ Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Frontend   | Next.js 14, React, TypeScript      |
| Styling    | Tailwind CSS, Framer Motion        |
| Backend    | Spring Boot 3.2, Java 17           |
| Database   | MongoDB                            |
| Auth       | JWT (jjwt)                         |
| Parsing    | Apache Tika                        |
| AI         | OpenAI GPT API (optional)          |

---

## 📦 Project Structure

```
ATSify/
├── frontend/                    # Next.js application
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── page.tsx         # Landing page
│   │   │   ├── login/           # Login page
│   │   │   ├── register/        # Register page
│   │   │   ├── dashboard/       # Dashboard (protected)
│   │   │   ├── upload/          # Resume upload (protected)
│   │   │   └── results/[id]/    # Analysis results (protected)
│   │   ├── components/          # Reusable components
│   │   ├── context/             # Auth context provider
│   │   └── services/            # API service layer
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/                     # Spring Boot application
│   ├── src/main/java/com/atsify/
│   │   ├── controller/          # REST controllers
│   │   ├── service/             # Business logic
│   │   ├── repository/          # MongoDB repositories
│   │   ├── model/               # Data models
│   │   ├── dto/                 # Request/Response DTOs
│   │   └── config/              # Security, JWT, CORS
│   └── pom.xml
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **Java** 17+
- **Maven** 3.9+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ATSify
```

### 2. Backend Setup

```bash
cd backend

# Configure environment (edit src/main/resources/application.properties)
# - Set MongoDB URI
# - Set JWT secret
# - (Optional) Set OPENAI_API_KEY environment variable

# Run the backend
./mvnw spring-boot:run
# Or on Windows:
mvnw.cmd spring-boot:run
```

The backend will start on **http://localhost:8080**.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will start on **http://localhost:3000**.

---

## ⚙️ Environment Variables

### Backend (`application.properties`)

| Variable               | Description                | Default                      |
|------------------------|----------------------------|------------------------------|
| `spring.data.mongodb.uri` | MongoDB connection URI   | `mongodb://localhost:27017/atsify` |
| `app.jwt.secret`       | JWT signing secret (256bit)| Pre-configured               |
| `app.jwt.expiration`   | Token expiry in ms         | `86400000` (24h)             |
| `OPENAI_API_KEY`       | OpenAI API key (optional)  | Empty (uses fallback)        |

### Frontend

The frontend proxies API requests to `http://localhost:8080` via Next.js rewrites (configured in `next.config.mjs`).

For production, set the `NEXT_PUBLIC_API_URL` environment variable.

---

## 🔌 API Endpoints

| Method | Endpoint              | Auth | Description               |
|--------|-----------------------|------|---------------------------|
| POST   | `/api/auth/register`  | ❌   | Register a new user       |
| POST   | `/api/auth/login`     | ❌   | Login and get JWT token   |
| POST   | `/api/resume/upload`  | ✅   | Upload resume (PDF/DOCX)  |
| GET    | `/api/resume/history` | ✅   | Get user's resume history |
| POST   | `/api/analyze`        | ✅   | Analyze resume vs JD      |
| GET    | `/api/analysis/{id}`  | ✅   | Get analysis by ID        |
| GET    | `/api/analysis/history` | ✅ | Get analysis history      |
| GET    | `/api/health`         | ❌   | Health check              |

---

## 🚀 Deployment

| Service  | Recommended Platform        |
|----------|-----------------------------|
| Frontend | [Vercel](https://vercel.com) |
| Backend  | [Render](https://render.com) / [Railway](https://railway.app) |
| Database | [MongoDB Atlas](https://www.mongodb.com/atlas) |

### Production Checklist

1. Update `app.cors.allowed-origins` in backend properties
2. Set a strong `app.jwt.secret`
3. Configure MongoDB Atlas URI
4. Set `OPENAI_API_KEY` if using AI suggestions
5. Build frontend: `npm run build`

---

## 📄 License

MIT © ATSify
