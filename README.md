# respo: Restaurant POS SaaS Platform

Multi-tenant restaurant ordering SaaS built with React (Vite 8), Express, PostgreSQL, Prisma 7, and Socket.io.

respo is a premium, fluid, and animated platform designed for modern restaurant operators.

## Stack

- Frontend: React 18, Vite 8, Framer Motion, Axios, Sass
- Backend: Node.js, Express, Socket.io, JWT
- Database: PostgreSQL
- ORM: Prisma `7.7.0` (latest)
- Prisma driver adapter: `@prisma/adapter-pg`

## Core Features

- **Instant Provisioning:** Start a new restaurant workspace in seconds.
- **QR Flow:** Dine-in and delivery QR systems built-in.
- **Premium UI:** Fluid animations and glassmorphism for a high-end feel.
- **Demo Mode:** Explore the full platform experience with one click.
- **Tenant Isolation:** Secure, isolated data for every restaurant.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Setup environment variables (see `.env.example`).
3. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
4. Run migrations:
   ```bash
   npm run prisma:migrate
   ```
5. Seed data (including demo):
   ```bash
   npm run prisma:seed
   ```
6. Start dev environment:
   ```bash
   npm run dev
   ```

## Demo Access

Visit `http://localhost:5173/admin/login` and click "Try Demo Experience" to instantly launch a pre-populated restaurant workspace.
