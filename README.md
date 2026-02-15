# AI-Powered Job-Specific CV Generator

> **Craft the perfect CV for every job application in seconds.**
> A professional, AI-driven SaaS platform that tailors your resume to specific job descriptions, ensuring maximum compatibility with ATS (Applicant Tracking Systems) and recruiters.

---

## 2️⃣ Overview

### **The Problem**
In today's competitive job market, generic CVs get rejected. Candidates need to tailor their experience, skills, and summary for *every single application* to pass ATS filters and catch a recruiter's eye. Doing this manually is time-consuming, error-prone, and exhausting.

### **The Solution**
**ResuMatch AI** (Project Code Name) automates this process. By analyzing a user's master profile and a target job description, our AI engine generates a highly optimized, job-specific CV in seconds. It highlights relevant skills, rewrites descriptions to match the job's tone, and keywords, all while maintaining a professional layout.

### **Vision**
To become the ultimate career companion that empowers job seekers to apply with confidence, quality, and speed.

---

## 3️⃣ Features

### 🚀 Core Capabilities
- **AI-Driven Personalization:** Uses advanced LLMs (GPT-4o/mini) to align your profile with specific job requirements.
- **Multi-Template Engine:** Choose from professionally designed templates (Professional, Classic, Modern, Creative) that adapt to your content.
- **WYSIWYG Editor:** Real-time preview that exactly matches the final PDF output.
- **Job-Specific Tailoring:** Automatically adjusts the "Professional Summary," "Skills," and "Work Experience" highlights based on the job description.

### 🎨 Design & Customization
- **Smart Layouts:** Templates automatically handle content overflow, pagination (future), and section ordering.
- **Multi-Language Support:** Generate CVs in English, Turkish, German, and more, regardless of your input language.
- **Profile Photo Integration:** Optional support for professional headshots with automatic styling adjustments.
- **Clickable Links:** All exported PDFs preserve hyperlinks (LinkedIn, GitHub, Portfolio) using a smart overlay system.

### 💼 Business Logic
- **Tiered Subscription System:** Robust credit and quota management for Free and Pro users.
- **Usage Tracking:** detailed logging of CV generations and PDF downloads.

---

## 4️⃣ System Architecture

The application follows a modern, decoupled Monorepo-style architecture optimized for scalability and user experience.

### **Frontend (Client-Side)**
- **Framework:** [Next.js](https://nextjs.org/) (React) with TypeScript.
- **Styling:** Tailwind CSS for rapid, responsive UI development.
- **State Management:** React Context & Hooks for managing auth and subscription state.
- **PDF Engine:** Client-side generation using `html-to-image` + `jspdf`. This ensures **100% visual fidelity** by capturing the rendered DOM rather than trying to recreate it on the server.

### **Backend (Server-Side)**
- **Framework:** [NestJS](https://nestjs.com/) for a modular, testable, and scalable server approach.
- **Database:** MSSQL / PostgreSQL (via Docker) managed with **Prisma ORM**.
- **AI Engine:** Integration with OpenRouter/OpenAI API for intelligent text generation.
- **Authentication:** JWT-based secure auth guards with role-based access control.

### **Data Flow**
1.  **User Input:** Profile data + Job Description link/text.
2.  **AI Processing:** Backend constructs a prompt context and requests optimized content from the LLM.
3.  **Structured Response:** LLM returns JSON data (summary, skills, enhanced descriptions).
4.  **Rendering:** Frontend receives JSON, hydrates the selected React Template.
5.  **Export:** User initiates download; Frontend clones the DOM, rasterizes it at high DPI, pads interactions, and generates PDF.

---

## 5️⃣ Template System

Our variable template engine separates **content** from **presentation**.

- **Component-Based:** Each template (e.g., `ProfessionalTemplate.tsx`, `ClassicTemplate.tsx`) is a standalone React component accepting a uniform prop interface (`GeneratedCV`).
- **Design Tokens:** Global typography and color tokens ensures consistency across different designs.
- **Responsive & Print-Ready:** Templates are coded with CSS Print media queries and fixed dimensional constraints (A4) to ensure they look perfect on screen and on paper.

---

## 6️⃣ Language System

The system supports full-content localization.

- **Input Agnostic:** Users can input their profile in any language.
- **Target Language:** During generation, users select a target language (e.g., "English", "French").
- **AI Translation & Adaptation:** The AI engine not only translates but *localizes* industry terms and tone to fit the target language's professional norms.

---

## 7️⃣ Subscription Model

We utilize a flexible Freemium model to encourage trial and upsell power users.

### **Free Plan**
Designed for casual job seekers.
- **Limit:** 3 Job-Specific CV generations per month.
- **Standard:** 1 General Profile-based CV.
- **Templates:** Access to "Classic" template only.

### **Pro Plan**
For active job hunters and career growth.
- **Limit:** **Unlimited** CV generations.
- **Templates:** Access to **All Premium Templates** (Professional, Creative, Executive).
- **Features:** Priority AI processing, Cover Letter generation (roadmap).
- **Pricing:**
    - **Monthly:** $15.00
    - **Yearly:** $99.00 (Save ~45%)

---

## 8️⃣ CV Generation Flow

1.  **Select Job:** User pastes a job posting URL or text.
2.  **Configure:** User selects:
    - **Template:** (e.g., Modern)
    - **Tone:** (e.g., Confident, Humble)
    - **Language:** (e.g., English)
    - **Photo:** (Yes/No)
3.  **AI Magic:** System validates quotas and sends prompt to AI.
4.  **Review:** Generated CV appears in the customized editor. User can manually tween summary or skills.
5.  **Export:** User clicks "Download PDF".
    - System creates a hidden, high-resolution clone of the CV.
    - Assets are pre-loaded.
    - Clone is captured and converted to PDF.

---

## 9️⃣ Preview & Export Consistency

We prioritize a **"What You See Is What You Get" (WYSIWYG)** experience.

- **Problem:** Server-side PDF generation often fails to render complex CSS (gradients, flexbox gaps, custom fonts) correctly.
- **Solution:** We use **Clone-and-Capture**.
    - The actual DOM node is cloned into a fixed `210mm` (A4) container off-screen.
    - Fonts and images are forced to load.
    - A screenshot (PNG) is taken at `3x` pixel density (High DPI).
    - This image is injected into a PDF container.
    - **Interactive Layer:** We calculate the coordinates of all `<a>` tags in the clone and overlay transparent, clickable link annotations in the PDF, ensuring functional links (LinkedIn, GitHub) without compromising visual layout.

---

## 🔟 Installation & Setup

### **Prerequisites**
- Node.js via (v20+)
- Docker & Docker Compose (for Database)
- OpenAI / OpenRouter API Key

### **1. Database Setup**
```bash
cd cv-generator-backend
docker-compose up -d
# Wait for MSSQL to initialize
npx prisma migrate dev
```

### **2. Backend Setup**
```bash
cd cv-generator-backend
npm install
# Configure .env with your DATABASE_URL and OPENAI_API_KEY
npm run start:dev
```
*Server runs on http://localhost:3000*

### **3. Frontend Setup**
```bash
cd cv-generator-frontend
npm install
npm run dev
```
*Client runs on http://localhost:3001*

---

## 11️⃣ Future Improvements

- [ ] **AI Cover Letter Generator:** Automatically write cover letters matching the CV's tone.
- [ ] **Analytics Dashboard:** Track which CV versions are performing best.
- [ ] **Resume Parsing:** Upload an existing PDF to auto-populate the master profile.
- [ ] **Enterprise API:** REST API for recruitment agencies.
