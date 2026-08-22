# VolunteerHub — Setup & Run Instructions

A Volunteer Activity Registration System built with React (Vite), Spring Boot (Java 21), MongoDB, and JWT authentication.

---

## Prerequisites

- Java 21 (JDK)
- Node.js + npm
- MongoDB Server running locally (auth-enabled)
- Maven Wrapper (included in the repo — no separate Maven install needed)

---

## 1. Database

Make sure MongoDB is running locally and that you have a database user with access to a `volunteerhub` database. The backend authenticates against MongoDB using the credentials set in the environment variables below.

---

## 2. Backend Setup

The backend reads its configuration from environment variables (see `backend/src/main/resources/application.properties`). Set the following before starting the app:

| Variable | Required | Default | Notes |
|---|---|---|---|
| `MONGODB_HOST` | No | `localhost` | |
| `MONGODB_PORT` | No | `27017` | |
| `MONGODB_DATABASE` | No | `volunteerhub` | |
| `MONGODB_AUTHENTICATION_DATABASE` | No | `volunteerhub` | |
| `MONGODB_USERNAME` | Yes | — | MongoDB user |
| `MONGODB_PASSWORD` | Yes | — | MongoDB password |
| `JWT_SECRET` | Yes | — | Secret key used to sign JWTs (HS256) |
| `JWT_EXPIRATION_MINUTES` | No | `60` | Token lifetime |
| `SERVER_PORT` | No | `8082` | |

**Run the backend** from the `backend/` folder:

```bash
.\mvnw spring-boot:run
```

The API starts on **http://localhost:8082**.

On first run, the data seeders (`UserDataSeeder`, `ActivityDataSeeder`, `RegistrationDataSeeder`) automatically populate sample users, activities, and registrations if the collections are empty — no manual seeding step required.

---

## 3. Frontend Setup

**Install dependencies and run** from the `frontend/` folder:

```bash
npm install
npm run dev
```

The app starts on **http://localhost:5173**.

Vite's dev server proxies all `/api/**` requests to `http://localhost:8082`, so no separate frontend `.env` file is needed — just make sure the backend is running first, on its default port.

---

## Quick Start Summary

1. Start MongoDB locally
2. Set the required environment variables (`MONGODB_USERNAME`, `MONGODB_PASSWORD`, `JWT_SECRET`)
3. `cd backend && .\mvnw spring-boot:run`
4. `cd frontend && npm install && npm run dev`
5. Open **http://localhost:5173**