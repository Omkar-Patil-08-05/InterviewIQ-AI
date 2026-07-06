# System Architecture

InterviewIQ AI relies on a modern serverless edge architecture powered by Next.js and the Vercel AI SDK.

## High-Level Flow
```mermaid
graph TD
  Client[Web Browser] -->|HTTP/REST| NextJS[Next.js App Router]
  NextJS -->|PostgreSQL| Prisma[Prisma ORM]
  NextJS -->|Streaming| Gemini[Google Gemini 1.5 Pro]
  NextJS -->|File Buffers| Parser[Mammoth / pdf-parse]
  NextJS -->|Adapter Pattern| Executor[CodeExecutionService]
```

## Modular Services
To maintain enterprise-grade separation of concerns, the API routes act strictly as thin controllers. All logic is pushed into the `src/lib/services/` layer:
- `AIResumeService`
- `AICodeReviewerService`
- `CodeExecutionService` (Mock, Judge0, Docker placeholders)
