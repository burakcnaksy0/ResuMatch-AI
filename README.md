# AI-Powered Job-Specific CV Generator

A full-stack application that generates job-specific, ATS-optimized CVs using AI.

## Project Structure

```
.
├── cv-generator-backend/     # Spring Boot backend
│   ├── src/
│   ├── pom.xml
│   └── .env
├── cv-generator-frontend/    # Next.js frontend
│   ├── app/
│   ├── package.json
│   └── .env.local
└── AI_CV_Generator_Project_Specification.md
```

## Tech Stack

### Backend
- **Framework:** NestJS (Node.js)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Authentication:** Supabase Auth + JWT Guards
- **AI:** Anthropic Claude API
- **PDF:** PDFKit

### Frontend
- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Auth:** Supabase Auth

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- Maven
- Supabase account
- Anthropic API key

### Backend Setup

1. Navigate to backend directory:
```bash
cd cv-generator-backend
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your credentials

4. Run the application:
```bash
./mvnw spring-boot:run
```

Backend will run on `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd cv-generator-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your credentials

5. Run the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Environment Variables

### Backend (.env)
- `SUPABASE_DB_PASSWORD` - Supabase database password
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `ANTHROPIC_API_KEY` - Anthropic Claude API key
- `JWT_SECRET` - Secret for JWT token generation

### Frontend (.env.local)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Development Roadmap

See [implementation_plan.md](/.gemini/antigravity/brain/b75a3f68-d038-4421-8e8d-a3d00c3c4c6b/implementation_plan.md) for detailed development phases.

## License

MIT
