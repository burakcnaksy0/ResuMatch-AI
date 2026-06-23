# ResuMatch AI

![ResuMatch AI](https://img.shields.io/badge/Status-Development-orange)
![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=nextdotjs)
![NestJS](https://img.shields.io/badge/NestJS-11.0-e0234e?logo=nestjs)
![Prisma](https://img.shields.io/badge/Prisma-7.6-2d3748?logo=prisma)
![Redis](https://img.shields.io/badge/Redis-5.0-dc382d?logo=redis)

ResuMatch AI is an intelligent, automated platform designed to solve the time-consuming process of tailoring resumes for specific job descriptions. By maintaining a single "Master Profile" and leveraging advanced Large Language Models (LLMs), ResuMatch AI dynamically generates highly optimized, job-specific CVs in structured formats and renders them into beautiful, export-ready templates.

---

## 🎯 The Problem It Solves

Job seekers often struggle with:
1. **Generic Resumes:** Sending the exact same resume to different roles reduces the chance of passing ATS (Applicant Tracking Systems).
2. **Time Consumption:** Manually rewriting bullet points to highlight relevant skills for every single application is exhausting.
3. **Formatting Nightmares:** Adjusting layouts in Word or PDF editors when adding or removing content often breaks the design.

**ResuMatch AI's Solution:**
You write your comprehensive Master Profile **once**. You paste the target Job Description. The AI intelligently selects, rewrites, and orders your experiences to perfectly match the job requirements, outputting a completely tailored CV injected directly into modern, professional templates.

---

## 🏗 System Architecture & Workflow

The platform operates on a robust microservices-inspired monolithic architecture using asynchronous message queues to handle long-running AI inference tasks.

### Core Workflow
1. **Master Profile Management:** Users input their entire work history, skills, projects, and education into a structured, validation-heavy form (Zod + React Hook Form).
2. **Job Description Parsing:** Users paste a raw job description they want to apply for.
3. **Asynchronous Processing (BullMQ):**
   - The user requests a tailored CV.
   - The backend creates a `PENDING` record and pushes a job to the Redis queue.
   - The frontend begins polling the job status.
4. **AI Generation:**
   - The NestJS worker picks up the job.
   - It hashes the profile and JD to check the **Redis Cache** (avoiding redundant LLM calls).
   - It constructs a strict system prompt and calls the LLM (Qwen 2.5 14B via Hugging Face Inference Endpoints).
   - The LLM returns a structured JSON payload representing the tailored CV.
5. **Template Rendering:** The frontend receives the JSON and dynamically renders it using one of four React-based templates (Modern, Classic, Minimal, Professional).
6. **PDF Export:** A custom iframe-based print mechanism exports the rendered DOM to a vector-perfect PDF, preserving clickable hyperlinks and exact CSS layouts.

---

## 💻 Tech Stack & Algorithms

### Frontend
- **Framework:** Next.js 16.2 (App Router, Turbopack)
- **UI Library:** React 19, TailwindCSS 4
- **State & Data Fetching:** React Query (TanStack Query v5)
- **Forms & Validation:** React Hook Form + Zod (Strict protocol-aware URL validation)
- **PDF Export:** Native browser Print API via isolated iframes with specific `@media print` CSS configurations to maintain active annotations (clickable links).

### Backend
- **Framework:** NestJS 11
- **Database:** PostgreSQL with Prisma ORM
- **Caching & Queues:** Redis, BullMQ
- **Authentication:** JWT (JSON Web Tokens) with Passport, bcrypt for password hashing.
- **AI Integration:** OpenAI Node SDK configured to route to Hugging Face Inference Endpoints.
- **Scheduling:** `@nestjs/schedule` for automated daily database backups.

### AI & Algorithms
- **LLM Model:** `Qwen/Qwen2.5-14B-Instruct:featherless-ai`
- **Structured Prompting:** The AI is strictly prompted to return only valid JSON matching a predefined schema (validated via Zod on the backend).
- **Idempotency & Caching:** SHA-256 hashing of the user profile and job description creates a unique cache key. If the same profile applies to the exact same job description within 24 hours, the result is served instantly from Redis in `O(1)` time.
- **Soft-Deletion & Cascades:** Database integrity is maintained using Prisma's `onDelete: Cascade` combined with application-level soft-delete patterns (`deletedAt`) to preserve historical data while maintaining referential integrity.

---

## 📂 Project Structure

```text
ResuMatchAI/
├── backend/                  # NestJS API Server
│   ├── prisma/               # Database Schema & Migrations
│   ├── src/
│   │   ├── modules/
│   │   │   ├── ai/           # LLM Integration & Prompt Building
│   │   │   ├── auth/         # JWT Authentication
│   │   │   ├── backup/       # Automated PostgreSQL Backups
│   │   │   ├── cv/           # CV Generation & Retrieval Logic
│   │   │   ├── job/          # Job Description Management
│   │   │   ├── profile/      # Master Profile CRUD
│   │   │   └── queue/        # BullMQ Processors (cv-generation)
│   │   └── main.ts           # Application Entrypoint
├── frontend/                 # Next.js Web Application
│   ├── src/
│   │   ├── app/              # Next.js App Router Pages
│   │   ├── components/
│   │   │   └── cv/templates/ # React Components for CV Layouts
│   │   ├── lib/
│   │   │   ├── api/          # Axios Interceptors & API Clients
│   │   │   └── export/       # PDF Generation Utilities
├── scripts/                  # Shell scripts for DB Backup/Restore
└── docker-compose.yml        # Local PostgreSQL & Redis infrastructure
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20
- Docker & Docker Compose
- API Key for Hugging Face or OpenAI

### 1. Start Infrastructure (Database & Redis)
```bash
docker-compose up -d
```

### 2. Setup Backend
```bash
cd backend
npm install
# Set up your .env file with DATABASE_URL, REDIS_PORT, and AI API Keys
npx prisma db push
npm run start:dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
# Set up your .env.local file
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## 🛡 Security & Maintenance
- **Data Integrity:** Strict foreign key constraints and cascade deletions.
- **Automated Backups:** A cron job runs daily at 03:00 AM, triggering a `pg_dump` script that archives the database and automatically prunes backups older than 10 days.
- **Validation Layer:** Dual-layer validation (Frontend Zod + Backend Class-Validator) ensures URLs have correct protocols and strings meet length requirements to prevent template breaking.
