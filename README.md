# DevPulse API 💻🚀

DevPulse is an internal tech issue and feature tracker API designed for software development teams to report bugs, suggest features, coordinate resolutions, and track development velocity.

This application is built with a strict **3-Layer Architecture** (Routes -> Controllers -> Services) using **Node.js, Express, and TypeScript**, interacting with **PostgreSQL** via high-performance raw queries (no ORM) and connection pooling.

---

## 🛠️ Tech Stack & Architecture Highlights

*   **Runtime:** Node.js (LTS v24+)
*   **Language:** TypeScript (Strict Mode configured)
*   **Web Framework:** Express.js (v5)
*   **Database:** PostgreSQL (raw query execution using `pg` driver)
*   **Security:** JWT-based stateless authentication & `bcrypt` password hashing
*   **Development Utilities:** `tsx` (TypeScript Execute) & `nodemon`

### Key Architectural Patterns
1.  **3-Layer Architecture:**
    *   **Route Layer (`*.route.ts`):** Defines HTTP endpoints, registers path/query params, and hooks in route-specific authentication/authorization middlewares.
    *   **Controller Layer (`*.controller.ts`):** Handles incoming HTTP requests, triggers payload validations, maps raw request details to service inputs, and orchestrates standardized responses.
    *   **Service Layer (`*.service.ts`):** Encapsulates the core business and authorization logic (e.g., verifying if a user can update a specific issue) and executes queries against the database pool.
2.  **Database Connection Pooling:** Implements `pg.Pool` to maintain a set of active connections, significantly reducing overhead and avoiding connection exhaustion under load.
3.  **No-ORM Philosophy:** Leverages raw SQL queries for absolute control over indexing, parameters, query execution paths, and performance.

---

## 📂 Project Structure Map

```text
B7A2/
├── dist/                     # Compiled JavaScript production build output
├── src/                      # TypeScript source code
│   ├── config/               # Environment configuration loader (env.ts)
│   ├── db/                   # PostgreSQL connection configuration (index.ts)
│   ├── errors/               # Standardized application error definitions (AppError.ts)
│   ├── interfaces/           # Shared TypeScript contracts and shapes
│   ├── middleware/           # Express global & route middlewares
│   │   ├── auth.ts           # Token verification & role authorization middlewares
│   │   ├── errorHandler.ts   # Centralized global error handling middleware
│   │   ├── logger.ts         # Inbound request logging middleware
│   │   └── notFound.ts       # 404 route handler
│   ├── modules/              # Domain-specific modules (auth, issues)
│   │   ├── auth/             # Authentication components (route, controller, service, validation)
│   │   └── issues/           # Issue tracker components (route, controller, service, validation)
│   ├── scripts/              # Database initialization & migrations (initDb.ts)
│   ├── types/                # Express request type augmentations
│   ├── utils/                # General-purpose utility helpers (async handlers, response wrappers, jwt)
│   ├── app.ts                # Express application configuration
│   └── server.ts             # Application entrypoint & HTTP server startup logic
├── .env                      # Local environment configuration variables (Git ignored)
├── .env.example              # Template file for environment variables
├── nodemon.json              # Nodemon configuration for local watch mode
├── package.json              # Project scripts and dependencies
├── tsconfig.json             # TypeScript compiler settings
└── tsup.config.ts            # Optional bundler config for specific environments
```

---

## 🗄️ Database Schema & Constraints

The database consists of two tables: `users` and `issues`.

### 1. `users` Table
Stores user profiles and login credentials.

| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | *Auto-increment* | Unique identifier |
| `name` | `VARCHAR(255)` | `NOT NULL` | - | User's full name |
| `email` | `VARCHAR(255)` | `UNIQUE`, `NOT NULL` | - | User's login email |
| `password` | `VARCHAR(255)` | `NOT NULL` | - | Hashed password |
| `role` | `VARCHAR(50)` | `CHECK (role IN ('contributor', 'maintainer'))` | `'contributor'` | Role-based authorization |
| `created_at` | `TIMESTAMP` | `WITH TIME ZONE` | `CURRENT_TIMESTAMP` | Signup timestamp |
| `updated_at` | `TIMESTAMP` | `WITH TIME ZONE` | `CURRENT_TIMESTAMP` | Last updated timestamp |

### 2. `issues` Table
Stores bugs and feature requests reported by contributors.

| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | *Auto-increment* | Unique identifier |
| `title` | `VARCHAR(150)` | `NOT NULL` | - | Summary of the issue |
| `description` | `TEXT` | `NOT NULL` | - | Detailed text description |
| `type` | `VARCHAR(50)` | `CHECK (type IN ('bug', 'feature_request'))` | - | Issue classification |
| `status` | `VARCHAR(50)` | `CHECK (status IN ('open', 'in_progress', 'resolved'))` | `'open'` | Life-cycle state |
| `reporter_id` | `INTEGER` | `NOT NULL` (linked to `users.id`) | - | User who reported the issue |
| `created_at` | `TIMESTAMP` | `WITH TIME ZONE` | `CURRENT_TIMESTAMP` | Creation timestamp |
| `updated_at` | `TIMESTAMP` | `WITH TIME ZONE` | `CURRENT_TIMESTAMP` | Last modification timestamp |

---

## 🚀 Step-by-Step Installation & Setup

Follow these steps to set up the project locally on your machine.

### Prerequisites
Make sure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v24 or later)
*   [PostgreSQL](https://www.postgresql.org/) (v15 or later) or a free [NeonDB Cloud Account](https://neon.tech/)

---

### Step 1: Install Dependencies
Open your terminal in the project root directory and run:
```bash
npm install
```

---

### Step 2: Configure Environment Variables
1. Duplicate the `.env.example` template and name the new file `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and configure your parameters:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database_name]?sslmode=disable
   JWT_SECRET=your_long_random_jwt_secret_key
   JWT_EXPIRES_IN=7d
   ```
   > [!NOTE]
   > Replace the placeholder `DATABASE_URL` with your actual local or cloud connection string.

---

### Step 3: Database Provisioning (2 Options)

#### Option A: Cloud Provisioning via NeonDB (Recommended)
1. Go to [neon.tech](https://neon.tech/) and register a free account.
2. Create a new project named `devpulse`.
3. Locate your connection string on the Dashboard page under **Connection Details**.
4. In your `.env` file, update the `DATABASE_URL` with this connection string. It will look like this:
   `DATABASE_URL=postgresql://neondb_owner:password@ep-orange-wave-ap2mcmzk-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require`

#### Option B: Local PostgreSQL Provisioning
1. Start your local PostgreSQL server instance.
2. Open your terminal or query tool (like pgAdmin or `psql`) and run:
   ```sql
   CREATE DATABASE devpulse;
   ```
3. Update your `.env` file connection string:
   `DATABASE_URL=postgresql://postgres:password@localhost:5432/devpulse?sslmode=disable`
   *(Replace `postgres` and `password` with your local database credentials)*.

---

### Step 4: Initialize the Database Schema
To automatically create the required database tables and clean up old data, execute the initialization script:
```bash
npm run db:init
```
Upon success, you should see:
```text
Initializing database schema...
Database initialized successfully.
```

---

### Step 5: Start the Application

#### Running in Development Mode (with hot-reload):
```bash
npm run dev
```
The server will boot and listen on your configured port (e.g., `5000`):
```text
Successfully connected to the PostgreSQL database (NeonDB compatible)
Server is running on port 5000
```

#### Running in Production Mode:
To compile TypeScript into optimized JavaScript and launch the production build, run:
```bash
npm run build
npm start
```

---

## 🔒 Authorization Matrix

To understand the system workflow, keep in mind these authorization rules enforced in the routes and service layers:

1.  **Public Actions:**
    *   Getting the list of all issues: `GET /api/issues`
    *   Retrieving a specific issue by ID: `GET /api/issues/:id`
2.  **Contributor Permissions:**
    *   Can create issues: `POST /api/issues`
    *   Can update **only their own** issues, and **only if** the issue status is still `'open'`.
    *   Can **never** change the status of an issue or delete an issue.
3.  **Maintainer Permissions:**
    *   Can update **any** issue's fields (title, description, type, status).
    *   Can change issue status (`'open'`, `'in_progress'`, `'resolved'`).
    *   Can delete **any** issue: `DELETE /api/issues/:id`.

---

## 📡 API Reference & Usage Guide

### Health Check / Root endpoint
*   **URL:** `GET /`
*   **Headers:** None
*   **Response Body (200 OK):**
    ```text
    DevPulse API is running
    ```

---

### 1. User Registration (Signup)
Create a new user account. Role must be either `contributor` or `maintainer`.

*   **URL:** `POST /api/auth/signup`
*   **Headers:** `Content-Type: application/json`
*   **Request Body Example:**
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "password": "securepassword123",
      "role": "contributor"
    }
    ```
*   **Response Example (201 Created):**
    ```json
    {
      "success": true,
      "statusCode": 201,
      "message": "User registered successfully",
      "data": {
        "id": 1,
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "contributor",
        "created_at": "2026-05-23T00:00:00.000Z",
        "updated_at": "2026-05-23T00:00:00.000Z"
      }
    }
    ```
*   **cURL command:**
    ```bash
    curl -X POST http://localhost:5000/api/auth/signup \
      -H "Content-Type: application/json" \
      -d "{\"name\": \"Jane Doe\", \"email\": \"jane@example.com\", \"password\": \"securepassword123\", \"role\": \"contributor\"}"
    ```

---

### 2. User Authentication (Login)
Exchanges user credentials for a signed JSON Web Token (JWT).

*   **URL:** `POST /api/auth/login`
*   **Headers:** `Content-Type: application/json`
*   **Request Body Example:**
    ```json
    {
      "email": "jane@example.com",
      "password": "securepassword123"
    }
    ```
*   **Response Example (200 OK):**
    ```json
    {
      "success": true,
      "statusCode": 200,
      "message": "Login successful",
      "data": {
        "user": {
          "id": 1,
          "name": "Jane Doe",
          "email": "jane@example.com",
          "role": "contributor"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
    ```
*   **cURL command:**
    ```bash
    curl -X POST http://localhost:5000/api/auth/login \
      -H "Content-Type: application/json" \
      -d "{\"email\": \"jane@example.com\", \"password\": \"securepassword123\"}"
    ```

---

### 3. Create Issue
Add a new issue (bug or feature request) to the database tracker.

*   **URL:** `POST /api/issues`
*   **Headers:**
    *   `Content-Type: application/json`
    *   `Authorization: Bearer <your_jwt_token>`
*   **Request Body Example:**
    ```json
    {
      "title": "Database connection times out under heavy load",
      "description": "The pg client pool runs out of available connections during peaks, causing the request to timeout after 30 seconds of waiting.",
      "type": "bug"
    }
    ```
*   **Response Example (201 Created):**
    ```json
    {
      "success": true,
      "statusCode": 201,
      "message": "Issue created successfully",
      "data": {
        "id": 1,
        "title": "Database connection times out under heavy load",
        "description": "The pg client pool runs out of available connections during peaks, causing the request to timeout after 30 seconds of waiting.",
        "type": "bug",
        "status": "open",
        "reporter_id": 1,
        "created_at": "2026-05-23T00:10:00.000Z",
        "updated_at": "2026-05-23T00:10:00.000Z"
      }
    }
    ```
*   **cURL command:**
    ```bash
    curl -X POST http://localhost:5000/api/issues \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
      -d "{\"title\": \"Database connection times out under heavy load\", \"description\": \"The pg client pool runs out of available connections during peaks, causing the request to timeout after 30 seconds of waiting.\", \"type\": \"bug\"}"
    ```

---

### 4. Get All Issues
Retrieve all registered issues. Anyone can read the issue list. Supports optional query parameters.

*   **URL:** `GET /api/issues`
*   **Query Parameters:**
    *   `sort` (Optional): `'newest'` (default) or `'oldest'`
    *   `type` (Optional): Filter by `'bug'` or `'feature_request'`
    *   `status` (Optional): Filter by `'open'`, `'in_progress'`, or `'resolved'`
*   **Response Example (200 OK):**
    ```json
    {
      "success": true,
      "statusCode": 200,
      "message": "Issues retrieved successfully",
      "data": [
        {
          "id": 1,
          "title": "Database connection times out under heavy load",
          "description": "The pg client pool runs out of available connections during peaks, causing the request to timeout after 30 seconds of waiting.",
          "type": "bug",
          "status": "open",
          "created_at": "2026-05-23T00:10:00.000Z",
          "updated_at": "2026-05-23T00:10:00.000Z",
          "reporter": {
            "id": 1,
            "name": "Jane Doe",
            "role": "contributor"
          }
        }
      ]
    }
    ```
*   **cURL command (with sorting and filtering):**
    ```bash
    curl "http://localhost:5000/api/issues?sort=newest&type=bug&status=open"
    ```

---

### 5. Get Issue By ID
Retrieve details of a specific issue.

*   **URL:** `GET /api/issues/:id`
*   **Headers:** None
*   **Response Example (200 OK):**
    ```json
    {
      "success": true,
      "statusCode": 200,
      "message": "Issue retrieved successfully",
      "data": {
        "id": 1,
        "title": "Database connection times out under heavy load",
        "description": "The pg client pool runs out of available connections during peaks, causing the request to timeout after 30 seconds of waiting.",
        "type": "bug",
        "status": "open",
        "created_at": "2026-05-23T00:10:00.000Z",
        "updated_at": "2026-05-23T00:10:00.000Z",
        "reporter": {
          "id": 1,
          "name": "Jane Doe",
          "role": "contributor"
        }
      }
    }
    ```
*   **cURL command:**
    ```bash
    curl http://localhost:5000/api/issues/1
    ```

---

### 6. Update Issue
Modify fields of an existing issue.

*   **URL:** `PATCH /api/issues/:id`
*   **Headers:**
    *   `Content-Type: application/json`
    *   `Authorization: Bearer <your_jwt_token>`
*   **Request Body Example (e.g. updating description):**
    ```json
    {
      "description": "Updated description with more information regarding NeonDB connection limits."
    }
    ```
*   **Response Example (200 OK):**
    ```json
    {
      "success": true,
      "statusCode": 200,
      "message": "Issue updated successfully",
      "data": {
        "id": 1,
        "title": "Database connection times out under heavy load",
        "description": "Updated description with more information regarding NeonDB connection limits.",
        "type": "bug",
        "status": "open",
        "reporter_id": 1,
        "created_at": "2026-05-23T00:10:00.000Z",
        "updated_at": "2026-05-23T00:15:00.000Z"
      }
    }
    ```
*   **cURL command:**
    ```bash
    curl -X PATCH http://localhost:5000/api/issues/1 \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
      -d "{\"description\": \"Updated description with more information regarding NeonDB connection limits.\"}"
    ```
*   **Errors (Examples):**
    *   If a contributor attempts to edit another user's issue (403 Forbidden):
        ```json
        {
          "success": false,
          "statusCode": 403,
          "message": "You can only update your own issues"
        }
        ```
    *   If a contributor attempts to edit an issue that is no longer `'open'` (409 Conflict):
        ```json
        {
          "success": false,
          "statusCode": 409,
          "message": "You can only update open issues"
        }
        ```

---

### 7. Delete Issue
Completely remove an issue from the system database. **(Restricted to Maintainers)**

*   **URL:** `DELETE /api/issues/:id`
*   **Headers:**
    *   `Authorization: Bearer <maintainer_jwt_token>`
*   **Response Example (200 OK):**
    ```json
    {
      "success": true,
      "statusCode": 200,
      "message": "Issue deleted successfully"
    }
    ```
*   **cURL command:**
    ```bash
    curl -X DELETE http://localhost:5000/api/issues/1 \
      -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    ```

---

## ☁️ Deployment Guide (NeonDB + Vercel / Render)

### Database Configuration (NeonDB)
1.  Initialize your database via your connection string in the local development terminal first using `npm run db:init` so the tables exist in the remote database.
2.  If the deployment server requires secure SSL verification, ensure the `DATABASE_URL` has `?sslmode=require` appended to the end.

### Deploying to Render
1.  Sign in to [Render](https://render.com) and click **New > Web Service**.
2.  Connect your GitHub repository.
3.  Choose runtime **Node**.
4.  Configure the build settings:
    *   **Build Command:** `npm install && npm run build`
    *   **Start Command:** `npm start`
5.  Under the **Environment Variables** section, add:
    *   `PORT` (e.g., `10000`)
    *   `NODE_ENV` (`production`)
    *   `DATABASE_URL` (Your NeonDB connection string)
    *   `JWT_SECRET` (A strong random secret string)
    *   `JWT_EXPIRES_IN` (`7d` or custom expiration)
6.  Click **Deploy Web Service**.
