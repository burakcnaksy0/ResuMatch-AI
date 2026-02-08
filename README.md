# AI-Powered Job-Specific CV Generator

This monorepo contains a comprehensive solution for generating job-specific Curricula Vitae (CVs) using Artificial Intelligence. The system analyzes job postings and a user's professional profile to create tailored, optimized CVs that increase the chances of passing ATS (Applicant Tracking Systems) and catching recruiters' attention.

## 🚀 Key Features

*   **AI-Driven Content Tailoring**: Uses advanced LLMs (OpenAI, Anthropic, Gemini) to rewrite and optimize CV content based on specific job descriptions.
*   **Job Posting Analysis**: Automatically extracts key skills and requirements from job postings (supports LinkedIn and raw text).
*   **High-Fidelity PDF Generation**: "What You See Is What You Get" (WYSIWYG) PDF export functionality, ensuring the downloaded CV matches the preview exactly.
*   **Comprehensive Profile Management**: detailed management of:
    *   Work Experience
    *   Education
    *   Skills
    *   Projects
    *   Languages
    *   Certifications
*   **Secure Authentication**: robust JWT-based authentication system with email verification and password reset flows.
*   **Modern Dashboard**: A sleek, user-friendly interface to manage multiple CV versions and job applications.
*   **Aesthetics**: Premium design using Tailwind CSS with responsive layouts and smooth interactions.

## 📸 Screenshots

| Login Page | Dashboard |
|:---:|:---:|
| ![Login Page](./images/login_page.png) | ![Dashboard](./images/dashboard_page.png) |

| Profile Management | Job Analysis |
|:---:|:---:|
| ![Profile Page](./images/profile_page.png) | ![Jobs Page](./images/jobs_page.png) |

| Generated CV Preview | Downloaded PDF |
|:---:|:---:|
| ![Generated CV](./images/generated_cv_page.png) | ![Downloaded CV](./images/downloaded_cv_page.png) |


## 🛠 Tech Stack

### Backend (`cv-generator-backend`)
*   **Framework**: [NestJS](https://nestjs.com/) (Node.js)
*   **Database**: PostgreSQL (via [Prisma ORM](https://www.prisma.io/))
*   **AI Integration**: OpenAI API, Anthropic Claude, Google Gemini
*   **Authentication**: Passport.js & JWT
*   **Email**: Resend API
*   **Scraping**: Puppeteer (for job analysis)
*   **Tools**: ESLint, Prettier, Jest

### Frontend (`cv-generator-frontend`)
*   **Framework**: [Next.js](https://nextjs.org/) 15+ (App Router)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
*   **Icons**: Lucide React, Heroicons
*   **State Management**: React Hooks
*   **Forms**: React Hook Form + Zod validation
*   **PDF Tools**: `html-to-image`, `jspdf`

## 📂 Project Structure

```
├── cv-generator-backend/     # NestJS API Server
│   ├── src/
│   │   ├── ai/               # AI Service integrations
│   │   ├── auth/             # Authentication logic
│   │   ├── prisma/           # Database connection
│   │   ├── [modules]/        # Feature modules (profile, jobs, etc.)
│   │   └── main.ts           # Entry point
│   └── prisma/schema.prisma  # Database schema
│
├── cv-generator-frontend/    # Next.js Client
│   ├── app/                  # App Router pages
│   ├── components/           # Reusable UI components
│   ├── lib/                  # Utilities (API client, helpers)
│   └── public/               # Static assets
```

## ⚡ Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- PostgreSQL Database
- API Keys (OpenAI, Resend, etc.)

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd cv-generator-backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    Create a `.env` file based on the example and configure your database URL and API keys.
4.  Run database migrations:
    ```bash
    npx prisma migrate dev
    ```
5.  Start the development server:
    ```bash
    npm run start:dev
    ```
    The API will be available at `http://localhost:3000`.

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd cv-generator-frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    Create a `.env.local` file with the backend API URL.
4.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3001` (or next available port).

## 🔒 Environment Variables

### Backend (`.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your_jwt_secret"
OPENAI_API_KEY="sk-..."
RESEND_API_KEY="re_..."
# Add other provider keys as needed
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

## 📝 Usage Flow

1.  **Register/Login**: Create an account to start saving your data.
2.  **Build Profile**: Enter your career history, education, and skills in the Profile section.
3.  **Find a Job**: Paste a LinkedIn URL or job description text into the "Job Analysis" tool.
4.  **Generate CV**: The AI will analyze the job and your profile to generate a targeted CV.
5.  **Customize**: Review the generated content, choose a template, and make manual edits if needed.
6.  **Download**: Export your perfect CV as a PDF.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
