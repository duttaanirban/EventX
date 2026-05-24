# EventX

EventX is a production-style smart event ticketing platform with Razorpay payments, QR tickets, organizer check-in, real-time updates, email notifications, and role-based dashboards.

## Features

- Attendee registration, login, refresh-token sessions, Google OAuth route wiring, and password reset
- Event browse, search, category/city filters, sorting, pagination, and event detail pages
- Razorpay order creation, payment signature verification, webhook handling, payment failure tracking, and refund marking
- QR ticket generation with encrypted validation token and duplicate check-in prevention
- Email templates for welcome, password reset, and booking confirmation with QR attachment
- Organizer dashboard with event CRUD, attendees, analytics charts, and QR scanner
- Admin dashboard with platform analytics, user/organizer management, ban controls, payment monitoring, and fraud-risk flags
- Socket.io live availability and check-in updates
- Swagger API documentation at `/api/docs`
- Docker, Docker Compose, GitHub Actions CI, Vercel config, and Render blueprint

## Tech Stack

Frontend: React, Vite, Tailwind CSS, React Router, Axios, React Query, Recharts, Framer Motion, React Hook Form, Zod, html5-qrcode, Socket.io client.

Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Passport Google OAuth, Razorpay, qrcode, Nodemailer, Socket.io, Swagger, Jest, Supertest.

DevOps: Docker, Docker Compose, GitHub Actions, Vercel, Render, MongoDB Atlas.

## Project Structure

```text
EventSphere/
  client/
    src/components
    src/context
    src/hooks
    src/layouts
    src/pages
    src/routes
    src/services
    src/styles
    src/utils
  server/
    src/config
    src/controllers
    src/jobs
    src/middlewares
    src/models
    src/routes
    src/services
    src/socket
    src/utils
    src/validators
    tests/
```

## Installation

```bash
npm install
```

Create environment files:

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

## Environment Variables

Backend minimum for local development:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/eventx
CLIENT_URL=http://localhost:5173
JWT_ACCESS_SECRET=replace-with-long-random-secret
JWT_REFRESH_SECRET=replace-with-long-random-secret
JWT_RESET_SECRET=replace-with-long-random-secret
COOKIE_SECRET=replace-with-long-random-secret
QR_SECRET=replace-with-long-random-secret
```

Frontend minimum:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

## Razorpay Setup

1. Create a Razorpay test account.
2. Copy Key ID into `RAZORPAY_KEY_ID` and `VITE_RAZORPAY_KEY_ID`.
3. Copy Key Secret into `RAZORPAY_KEY_SECRET`.
4. Add a webhook in Razorpay Dashboard pointing to:

```text
https://your-api-domain.com/api/payments/webhook
```

5. Subscribe to `payment.failed` and set `RAZORPAY_WEBHOOK_SECRET`.

## MongoDB Setup

Local MongoDB:

```bash
docker compose up mongo
```

MongoDB Atlas:

1. Create a free cluster.
2. Add your IP address or deployment provider IP access.
3. Create a database user.
4. Set `MONGO_URI` to the Atlas connection string.

## Run Locally

Start backend:

```bash
npm run dev --workspace eventx-server
```

Start frontend:

```bash
npm run dev --workspace eventx-client
```

Seed demo data:

```bash
npm run seed --workspace eventx-server
```

Demo accounts after seeding:

```text
admin@eventx.app / Password123
organizer@eventx.app / Password123
user@eventx.app / Password123
```

## Docker

Create `server/.env`, then run:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:4173`
- Backend: `http://localhost:5000`
- API docs: `http://localhost:5000/api/docs`
- MongoDB: `localhost:27017`

## API Documentation

Swagger UI is available after starting the backend:

```text
http://localhost:5000/api/docs
```

Core endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/events`
- `GET /api/events/:id`
- `POST /api/events`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`
- `POST /api/bookings`
- `GET /api/bookings/user`
- `GET /api/bookings/event/:id`
- `POST /api/payments/create-order`
- `POST /api/payments/verify`
- `POST /api/payments/webhook`
- `POST /api/qr/validate`

## Testing

```bash
npm run lint --workspace eventx-server
npm test --workspace eventx-server
npm run lint --workspace eventx-client
npm test --workspace eventx-client
npm run build --workspace eventx-client
```

Backend tests use `mongodb-memory-server` with a workspace-local binary cache at `server/.cache/mongodb-binaries`.

## Deployment

### Backend on Render

Use `render.yaml` or create a Web Service manually.

Build command:

```bash
npm ci
```

Start command:

```bash
npm start --workspace eventx-server
```

Set all backend environment variables in Render and set `CLIENT_URL` to your Vercel URL.

### Frontend on Vercel

Use the included `client/vercel.json`.

Set environment variables:

```env
VITE_API_URL=https://your-render-api.onrender.com/api
VITE_SOCKET_URL=https://your-render-api.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_live_or_test_key
```

### MongoDB Atlas

Set `MONGO_URI` on Render to your Atlas connection string. Use a production database user with a strong password and least-privilege network access.

## Security Notes

- Replace all secrets before deployment.
- Use HTTPS URLs for `CLIENT_URL`, `VITE_API_URL`, and `VITE_SOCKET_URL` in production.
- Configure Razorpay webhooks with a strong secret.
- Use app passwords or a transactional email provider for SMTP.
- Review `npm audit` output before production release. Some warnings are transitive/deprecated package notices.

## Screenshots

Add screenshots to `docs/screenshots/`:

- `landing.png`
- `events.png`
- `checkout.png`
- `ticket.png`
- `organizer-dashboard.png`
- `admin-dashboard.png`

## Production Checklist

- [ ] Configure MongoDB Atlas
- [ ] Configure Razorpay test/live credentials
- [ ] Configure SMTP provider
- [ ] Configure Google OAuth callback URL
- [ ] Set Render backend environment variables
- [ ] Set Vercel frontend environment variables
- [ ] Run CI checks
- [ ] Test payment success and failure paths
- [ ] Test QR check-in on a real mobile camera
