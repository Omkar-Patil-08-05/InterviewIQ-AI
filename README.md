<div align="center">
  <h1>🚀 InterviewIQ AI</h1>
  <p><strong>The Ultimate AI-Powered Technical Interview & Career Readiness Platform</strong></p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](#)
  [![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white)](#)
  [![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](#)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](#)
  [![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-4285F4?logo=google&logoColor=white)](#)
  [![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](#)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

  <p align="center">
    <a href="#core-features">Features</a> •
    <a href="#system-architecture">Architecture</a> •
    <a href="#getting-started">Installation</a> •
    <a href="#complete-user-workflow">Workflow</a>
  </p>
</div>

---

**InterviewIQ AI** is an open-source, full-stack SaaS platform designed to bridge the gap between candidates and recruiters using advanced Artificial Intelligence. It transforms how candidates prepare for technical interviews by providing strict, FAANG-level mock interviews, a live sandboxed coding environment, and deep ATS gap analysis.

## 🌐 Live Demo

🚀 Coming Soon

Production deployment is currently in progress.

## 🚀 Highlights

- ✅ Production Ready SaaS
- 🤖 AI Powered
- 📄 Resume Intelligence
- 💼 ATS Analysis
- 🧠 AI Interview Engine
- 💻 Live Coding Platform
- 📊 Career Readiness Analytics
- 👔 Recruiter Evaluation Portal

## ✨ Feature Highlights

- **Resume Intelligence**: Parses PDF resumes using AI to extract structured data and map out career trajectories.
- **ATS Analysis**: Instantly scores your resume against target job requirements to identify critical missing skills.
- **Job Description Intelligence**: Break down complex JDs into actionable keywords and required competencies.
- **AI Interview Engine**: A strict, context-aware AI interviewer that dynamically alters difficulty based on your performance.
- **Live Coding Workspace**: Integrated Monaco editor with sandboxed execution for Python, JavaScript, TypeScript, and Java. Includes deep AI Time/Space complexity reviews.
- **AI Reports**: Instant, detailed feedback on interview performance, behavioral flags, and technical accuracy.
- **Coding Analytics**: Tracks algorithmic proficiency over time across different language ecosystems.
- **Career Readiness Hub**: Aggregates all performance data into a massive radar chart to predict your readiness for top-tier tech companies.
- **Recruiter Portal**: Generates a highly confidential, internal hiring assessment report summarizing candidate strengths, risks, and a final "Hire/Reject" recommendation.

## 🏗️ System Architecture

```mermaid
graph TD
    A[Browser] --> B[Next.js 16 App]
    B --> C[Supabase Auth]
    B --> D[Prisma ORM]
    D --> E[(PostgreSQL)]
    B --> F[Gemini AI]
    B --> G[Piston Docker]

    F --> H[Resume Intelligence]
    F --> I[Interview Engine]
    F --> J[Career Readiness]

    G --> K[Code Execution]

    H --> L[Recruiter Portal]
    I --> L
    J --> L
    K --> L
```

## 🛠️ Technology Stack

| Domain | Technology | Description |
| --- | --- | --- |
| **Frontend** | Next.js 16 (App Router) | React Server Components, Turbopack |
| **Backend** | Next.js API Routes | Serverless API handlers |
| **Database** | PostgreSQL | Managed via Supabase |
| **ORM** | Prisma (v7.2) | Type-safe database client |
| **Auth** | Supabase Auth | Magic Links & OAuth |
| **AI / LLM** | Vercel AI SDK | Streaming integrations for Latest Google Gemini Models |
| **Styling** | Tailwind CSS | Utility-first CSS, Framer Motion, Radix UI |
| **Execution** | Piston API | Dockerized code evaluation engine |

## 📸 Screenshots

> Screenshots and demo GIFs will be added after the first production deployment.

## 🔄 Complete User Workflow

1. **Resume** 📄 → Candidate uploads PDF resume. AI parses and extracts structured data.
2. **JD** 🎯 → Candidate pastes target Job Description.
3. **ATS** 📊 → AI performs a gap analysis, generating an ATS match score and improvement plan.
4. **Interview** 🗣️ → Candidate begins a strict technical interview customized to the JD.
5. **Coding** 💻 → Candidate solves algorithmic challenges in the live Monaco IDE.
6. **Reports** 📈 → Session ends; AI generates a comprehensive performance report.
7. **Career Readiness** 🎯 → Candidate checks the Hub to track long-term algorithmic and behavioral growth.
8. **Recruiter View** 👔 → Recruiter instantly exports a confidential "Hire/Reject" assessment PDF.

## 📁 Project Structure

```text
interview-iq-ai/
├── prisma/                 # Database schema and seed scripts
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js 16 App Router (Pages, Layouts, API)
│   │   ├── api/            # Serverless execution and AI routes
│   │   └── dashboard/      # Protected user dashboard views
│   ├── components/         # Reusable React UI components (Radix/shadcn)
│   └── lib/                # Core utilities
│       ├── services/       # AI, Parsing, and Database service singletons
│       └── supabase/       # Authentication clients
├── .env.example            # Environment variables
├── next.config.ts          # Turbopack and strict security headers
└── tailwind.config.ts      # UI styling tokens
```

## 🚀 Getting Started

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Omkar-Patil-08-05/InterviewIQ-AI.git
cd InterviewIQ-AI
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory and configure the following:

```env
# Database (PostgreSQL / Supabase)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# AI Provider
GOOGLE_GENERATIVE_AI_API_KEY="your-google-gemini-api-key"

# Code Execution
PISTON_URL="http://localhost:2000/api/v2/execute"
```

### 3. Database Setup

Generate the Prisma Client and apply database migrations:

```bash
npx prisma generate

# For local development:
npx prisma migrate dev

# For production deployment:
npx prisma migrate deploy
```

*(Note: While `npx prisma db push` can be used for rapid local prototyping, `migrate` is recommended for managing state in this production-grade application).*

### 4. Run the Application

Start the Next.js development server with Turbopack:

```bash
npm run dev
```

Visit `http://localhost:3000` to access the platform.

## 🐳 Docker & Piston Setup

InterviewIQ AI uses [Piston](https://github.com/engineer-man/piston) to securely execute untrusted user code. To run this locally:

```bash
# Pull and run the Piston Docker image on port 2000
docker run -d -p 2000:2000 ghcr.io/engineer-man/piston
```

## ☁️ Deployment

- **Vercel**: The application is highly optimized for Vercel. Connect your repository and it will automatically detect the Next.js framework.
- **Supabase**: Set up a Supabase project for managed PostgreSQL and Auth. Update your Vercel environment variables with the provided connection strings.
- **Docker**: The Piston execution engine must be deployed on a VPS (like DigitalOcean or AWS EC2) as it requires a persistent Docker daemon.

## ⚡ Performance Optimizations

- **Parallel Data Fetching**: Heavy Dashboard and Recruiter queries utilize staggered `Promise.all` batches to prevent connection pool exhaustion.
- **Dynamic Imports**: Large libraries (like Recharts) are aggressively lazy-loaded using `next/dynamic` to shrink initial JavaScript payloads.
- **Strict Connection Pooling**: Prisma PostgreSQL pools are highly clamped to survive aggressive Next.js isolate spawning during hot-reloads.

## 🔒 Security Features

- **Strict Security Headers**: Denies iframe embedding (`X-Frame-Options: DENY`), forces strict origin referrer policies, and enforces HSTS.
- **Centralized Auth Utilities**: API routes are protected by shared `requireUser()` wrappers that instantly terminate unauthenticated requests.
- **Sandboxed Execution**: Candidate code is never evaluated on the host server; it is shipped to isolated, ephemeral Docker containers via Piston.

## 🗺️ Future Roadmap

- [ ] Voice-to-Text integration for mock behavioral interviews.
- [ ] Enterprise SAML/SSO login for corporate recruiting teams.
- [ ] Real-time multiplayer collaborative coding sessions.

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

InterviewIQ AI is an educational and portfolio project created to demonstrate production-grade full-stack software engineering, AI integration, and scalable SaaS architecture. It is not affiliated with or endorsed by Google, Microsoft, Amazon, Meta, or any other company referenced for interview preparation.

---
<div align="center">
  Built by **Omkar Patil**
</div>
