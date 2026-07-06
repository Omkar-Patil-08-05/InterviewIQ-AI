# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- InterviewIQ AI foundational features including Resume Intelligence, AI Interviews, Coding Workspace, Recruiter Portal, and Analytics.
- Global dashboard error boundaries to gracefully catch rate limits and API failures.
- Reusable `EmptyState` component implemented across History, Coding Analytics, and Career Intelligence to guide users with no data.
- Centralized structured JSON `Logger` service integrated across all API routes and AI services for production observability.
- Shared `requireUser` utility implemented to deduplicate authentication and 401 response logic across Server Actions.
- Comprehensive `README.md` with setup, architecture, and deployment instructions.
- Client-side filtering and real-time search implemented for Interview History list view.

### Changed
- PDF Export migration from `html2canvas` to native browser printing for robust CSS rendering.
- Optimized data fetching in dashboard routes using `Promise.all` for parallel execution.
- Dynamically imported heavy charting components (`Recharts`) to reduce initial bundle sizes.
- Standardized UI Button component with interactive hover states (`active:scale-[0.98]`) for tactile feedback.
- Augmented main navigation and sidebar with standard ARIA attributes (`aria-label`, `aria-current`) for better accessibility.
