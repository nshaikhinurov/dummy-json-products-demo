# Dummy JSON Products Demo

A portfolio pet project that demonstrates a production-style React dashboard on top of the DummyJSON API.

The app simulates a small internal product management tool with authentication, protected routes, localized UI, theme switching, and a data-heavy table flow.

## Why This Project

This project was built to showcase practical frontend engineering skills beyond static UI:

- Building a full app flow from login to protected business screens
- Designing reusable UI primitives and feature modules
- Managing async server data, caching, and optimistic updates
- Keeping UX polished with validation, toasts, loading states, and persistence

## Core Features

- Authentication flow with remember-me session persistence (localStorage and sessionStorage modes)
- Route guards for authenticated-only and public-only pages
- Product catalog with server-side pagination
- Debounced search integrated with remote filtering
- Column sorting with persisted user preference
- Add Product modal with form validation and dynamic category loading
- Optimistic cache updates after create to keep table state responsive
- Light, dark, and system theme support
- Internationalization with English and Russian language switching
- Not Found route and graceful API error handling with user-facing feedback

## Tech Stack

### Frontend

- React 19
- TypeScript 5.9
- Vite 7
- React Router 7

### Data and State

- TanStack Query for server-state management
- TanStack Table for tabular UI behavior
- TanStack Form for type-safe form handling
- React Context for authentication and theme providers

### UI and Styling

- Tailwind CSS 4
- Shadcn-style component architecture in shared ui modules
- Base UI primitives for accessible foundations
- Sonner toast notifications
- Lucide React icon library

### Quality and Tooling

- ESLint 9 with TypeScript and React Hooks rules
- Prettier 3 with Tailwind plugin
- pnpm as package manager

## Architecture Highlights

- Layered structure with clear separation between app, pages, and shared modules
- Dedicated API layer for auth and products requests
- Reusable storage utilities for auth session and i18n preferences
- Centralized query client configuration for consistent retry and refetch behavior
- Feature-first product page composition with isolated UI and domain helpers

## Project Structure

```text
src/
	app/        # providers, router, app bootstrap
	pages/      # feature pages (login, products, not-found)
	shared/
		api/      # HTTP/data access
		auth/     # auth types and persistence helpers
		i18n/     # translations and language persistence
		lib/      # shared hooks and helpers
		ui/       # reusable design-system components
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+

### Install

```bash
pnpm install
```

### Run Development Server

```bash
pnpm dev
```

### Production Build

```bash
pnpm build
pnpm preview
```

### Code Quality

```bash
pnpm typecheck
pnpm lint
pnpm format
```

## What This Demonstrates In A Portfolio

- End-to-end feature delivery, not isolated components
- Real-world state patterns for async data and user session handling
- Maintainable project organization and scalable UI composition
- Attention to UX details in forms, loading, feedback, and persistence

## Potential Next Improvements

- Edit and delete product workflows
- Better role-based auth and token refresh strategy
- E2E testing coverage with Playwright
- CI pipeline with lint, typecheck, and build gates
- Deployment with public demo URL
