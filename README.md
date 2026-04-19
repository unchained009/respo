# Restaurant POS SaaS Platform

Multi-tenant restaurant ordering SaaS built with React, Express, PostgreSQL, Prisma 7, and Socket.io.

Each restaurant gets its own isolated workspace with:

- a public marketing-to-subscription onboarding flow
- a unique `restaurantCode` and `adminCode`
- secure dine-in QR links per table
- a public delivery QR link for home delivery
- tenant-scoped menu, orders, tables, analytics, and settings
- admin and staff role support

## Stack

- Frontend: React, React Router, Axios, Sass
- Backend: Node.js, Express, Socket.io, JWT
- Database: PostgreSQL
- ORM: Prisma `7.7.0`
- Prisma driver adapter: `@prisma/adapter-pg`

## Folder Structure

```text
restaurant-pos-platform/
  client/
    src/
      components/
      context/
      pages/
      services/
      styles/
  server/
    prisma/
      migrations/
      schema.prisma
      seed.js
    src/
      config/
      controllers/
      middleware/
      routes/
      services/
      utils/
  package.json
  README.md
```

## Core SaaS Flow

1. A restaurant owner visits the landing page.
2. They choose `Rs. 650/month` or `Rs. 20,000 one-time`.
3. They submit onboarding details:
   - owner name
   - business name
   - phone
   - email
   - password
   - city
   - district
   - state
   - address
4. After payment success, the backend provisions a tenant workspace.
5. The system creates:
   - a unique restaurant record
   - a unique admin code
   - a tenant admin user
   - starter categories
   - starter menu items
   - starter tables
   - a delivery QR access token
6. The restaurant logs into its own dashboard and manages data only for that restaurant.

## Main Features

- Multi-restaurant SaaS landing page
- Subscription onboarding and auto-provisioning
- Tenant-isolated restaurant workspaces
- Restaurant code shown in guest and admin experiences
- Dark mode and light mode
- Secure QR ordering per table
- Home-delivery QR ordering
- Real-time order updates in admin dashboard
- Order lifecycle: `pending`, `accepted`, `preparing`, `served`, `completed`, `rejected`
- Menu and category management
- Table management with QR generation
- Restaurant settings page
- Sales analytics and top-selling items

## Environment Setup

Create [server/.env](/C:/Users/anony/Documents/Codex/2026-04-18-build-a-full-stack-restaurant-pos/server/.env) from [server/.env.example](/C:/Users/anony/Documents/Codex/2026-04-18-build-a-full-stack-restaurant-pos/server/.env.example).

```env
PORT=5000
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://USER:PASSWORD@YOUR-NEON-HOST-pooler.REGION.aws.neon.tech/neondb?sslmode=require&channel_binding=require
DIRECT_URL=postgresql://USER:PASSWORD@YOUR-NEON-HOST.REGION.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=replace-with-a-secure-secret
JWT_EXPIRES_IN=7d
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
APP_BASE_URL=http://localhost:5173
```

Notes:

- `DATABASE_URL` should use the Neon pooled host.
- `DIRECT_URL` should use the non-pooled direct host.
- Prisma 7 uses [server/prisma.config.ts](/C:/Users/anony/Documents/Codex/2026-04-18-build-a-full-stack-restaurant-pos/server/prisma.config.ts), so keeping `schema.prisma` in [server/prisma/schema.prisma](/C:/Users/anony/Documents/Codex/2026-04-18-build-a-full-stack-restaurant-pos/server/prisma/schema.prisma) is correct.

## Local Setup

Install dependencies from the project root:

```bash
npm install
```

Generate Prisma client:

```bash
npm run prisma:generate
```

Apply migrations:

```bash
npm run prisma:deploy
```

Seed demo data:

```bash
npm run prisma:seed
```

Start the app:

```bash
npm run dev
```

Useful URLs:

- Landing page: `http://localhost:5173`
- Admin login: `http://localhost:5173/admin/login`
- Backend API: `http://localhost:5000/api`
- Health check: `http://localhost:5000/api/health`

## Demo Seed

The seed script provisions a demo tenant and prints the generated admin code in the terminal.

It also creates:

- demo admin password: `Admin@123`
- demo staff login email: `staff@restaurant.com`
- demo staff password: `Staff@123`
- a delivery guest URL

Because admin codes are generated dynamically, use the value printed after `npm run prisma:seed`.

## API Overview

### Platform

- `GET /api/platform/stats`
- `POST /api/platform/subscribe`

### Auth

- `POST /api/auth/login`
- `GET /api/auth/me`

### Restaurant Settings and Guest Access

- `GET /api/restaurants/settings`
- `PUT /api/restaurants/settings`
- `GET /api/restaurants/delivery-qr`
- `GET /api/restaurants/:slug/access/:accessToken`

### Categories

- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### Menu

- `GET /api/menu`
- `GET /api/menu/:id`
- `POST /api/menu`
- `PUT /api/menu/:id`
- `DELETE /api/menu/:id`
- `DELETE /api/menu/reset`

### Orders

- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status`

### Tables

- `GET /api/tables`
- `POST /api/tables`
- `PUT /api/tables/:id`
- `DELETE /api/tables/:id`
- `GET /api/tables/:id/qr`

### Analytics

- `GET /api/analytics/summary`

## Production Notes

- The repo now uses a single Prisma 7 baseline migration:
  [server/prisma/migrations/20260419190000_saas_platform_baseline/migration.sql](/C:/Users/anony/Documents/Codex/2026-04-18-build-a-full-stack-restaurant-pos/server/prisma/migrations/20260419190000_saas_platform_baseline/migration.sql)
- All core restaurant data is tenant-scoped with `restaurantId`.
- Guest access is protected by `slug + accessToken`, so users cannot switch tables by editing the URL.
- Use `npm run prisma:deploy` during deployment, not `prisma migrate dev`.
- Add HTTPS, reverse proxy, rate limiting, request validation, and real payment integration before public launch.

## Verified

The current codebase was validated with:

- `npm run prisma:generate`
- `npm run prisma:deploy`
- `npm run prisma:seed`
- `npm run build`

And a live runtime check covering:

- restaurant subscription provisioning
- admin login with generated admin code
- settings fetch
- tables fetch
- delivery access resolution
- order creation
- order status update
- analytics refresh
