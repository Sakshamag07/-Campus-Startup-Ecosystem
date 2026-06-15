# Campus Startup Ecosystem (Startiva)

Campus Startup Ecosystem is a production-ready, full-stack application designed specifically for colleges and universities. It allows students to find co-founders, post and join projects, match with mentors, apply for internships, validate startup ideas using AI, and participate in hackathons.

## Features

- **Co-Founder Matching**: Match students based on complementary skills, interests, and matching scores.
- **Startup Project Hub**: Recruit team members, organize milestones, and update project progress.
- **Mentorship booking**: Search mentors, schedule video calls, and read feedback reviews.
- **Internship Marketplace**: Post positions, filter resumes, and rank candidates with AI.
- **AI Startup Validator**: Run comprehensive SWOT analysis, revenue model, competitor analysis, and risk evaluations on startup ideas.
- **Real-time Chat**: Connect with matched founders, teammates, and mentors.
- **Role-Based Access Control**: Separate dashboards for `Student`, `StartupFounder`, `Mentor`, `Investor`, `CollegeAdmin`, and `SuperAdmin`.

---

## Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS, TypeScript, Zustand, Socket.io-client, Framer Motion
- **Backend**: Node.js, Express, TypeScript, Socket.io, Prisma ORM
- **Database**: PostgreSQL
- **Orchestration**: Docker, Docker Compose, Nginx (Reverse Proxy)
- **External APIs**: OpenAI API, Razorpay Integration

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) and Docker Compose installed.
- [Node.js v18+](https://nodejs.org/) (for running local development without Docker).

### Configuration

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:password123@postgres:5432/campus_startup_db?schema=public"
JWT_SECRET="supersecretjwtkey123!"
JWT_REFRESH_SECRET="supersecretrefreshkey456!"
OPENAI_API_KEY="your_openai_api_key"
RAZORPAY_KEY_ID="rzp_test_yourkeyid"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
CLIENT_URL="http://localhost"
```

Create a `.env` file inside the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL="http://localhost/api"
NEXT_PUBLIC_SOCKET_URL="http://localhost"
```

---

## Running the Application

### 1. Running with Docker (Recommended)

To build and run all services (Frontend, Backend, Database, Nginx) simultaneously:

```bash
docker-compose up --build
```

The application will be accessible at:
- **Web App / Dashboard**: [http://localhost](http://localhost)
- **API Server Gateway**: [http://localhost/api](http://localhost/api)
- **Database Port**: `localhost:5432`

### 2. Manual Local Development

If you prefer running the servers locally without Docker, follow these steps:

#### Step A: Start PostgreSQL Database
Spin up PostgreSQL locally (either through a direct installation or just the DB docker container):
```bash
docker-compose up -d postgres
```

#### Step B: Setup & Start Backend API Server
```bash
cd backend
npm install
npx prisma db push
npm run dev
```

#### Step C: Setup & Start Next.js Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Folder Structure

```
├── backend/
│   ├── prisma/             # Schema definition
│   └── src/
│       ├── config/         # Configs (DB, OpenAI, Razorpay, Sockets)
│       ├── controllers/    # API controllers
│       ├── middleware/     # Auth & validation middlewares
│       ├── routes/         # Router declarations
│       ├── services/       # AI engines, match algorithms, etc.
│       └── index.ts        # Server entrypoint
├── frontend/
│   └── src/
│       ├── app/            # Next.js page routing
│       ├── components/     # UI Component library
│       ├── store/          # Zustand State Management
│       └── services/       # Axios API client setup
├── nginx/                  # Nginx proxy mapping
└── docker-compose.yml      # Service orchestration
```
