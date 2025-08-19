# Newtick Backend (Auth)

Express + MongoDB backend for Newtick authentication.

## Setup

1. Copy `.env.example` to `.env` and set values.
2. Install deps:

```bash
cd backend
npm install
```

3. Start server:

```bash
npm run dev
```

Server runs on `http://localhost:5000` by default.

## Endpoints

- POST `/api/auth/signup`
  - body: `{ "username": string, "email": string, "password": string, "name"?: string }`
  - sets `token` httpOnly cookie, returns `{ user, token }`

- POST `/api/auth/login`
  - body: `{ "emailOrUsername": string, "password": string }`
  - sets `token` httpOnly cookie, returns `{ user, token }`

- POST `/api/auth/logout`
  - clears cookie, returns `{ success: true }`

- GET `/api/auth/me`
  - requires auth; returns `{ user }`

## CORS

Configure `CORS_ORIGIN` in `.env` to your frontend URL (e.g. `http://localhost:3000`). 