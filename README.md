# DevPulse API

Internal Tech Issue & Feature Tracker API built with strict 3-Layer Architecture.

## Project Overview
DevPulse is a collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

## Features
- **User Authentication**: Secure JWT-based registration and login.
- **Role-based Authorization**: Clear distinction between `contributor` and `maintainer` access.
- **Issue Management**: Create, read, update, and delete issues with filtering and sorting.
- **Raw PostgreSQL Integration**: High-performance database interaction using raw queries via the `pg` driver (no ORMs).

## Tech Stack
- **Node.js (LTS 24+)**
- **TypeScript (Strict Mode)**
- **Express.js**
- **PostgreSQL (`pg`)**
- **bcrypt & jsonwebtoken**

---

## Folder Structure & Purpose
- `src/config/`: Contains environment configuration files (`env.ts`).
- `src/db/`: Contains the database connection pooling configuration.
- `src/modules/`: Contains the core feature modules (`auth`, `issues`), separated into Route, Controller, Service, and Validation layers (3-Layer Architecture).
- `src/middleware/`: Global Express middlewares for authentication, error handling, and 404 routes.
- `src/interfaces/`: Shared TypeScript interfaces/types used across multiple modules.
- `src/utils/`: Reusable helper functions (`asyncHandler`, `jwt`, `response`).
- `src/errors/`: Custom error classes (`AppError`).
- `src/constants/`: Centralized application constants (if any).
- `src/types/`: Custom type definitions (e.g., extending Express Request).
- `src/scripts/`: Database initialization scripts.

## Explanations

### Authentication Flow
1. User submits credentials to `/api/auth/login`.
2. The `auth.service.ts` verifies the email and compares the hashed password using `bcrypt`.
3. A JSON Web Token (JWT) is generated containing the user's `id`, `name`, and `role`.
4. The client includes this token in the `Authorization` header for subsequent requests.
5. The `auth` middleware verifies the token signature and expiration before allowing access.

### Database Connection Pooling
We use the `pg.Pool` class to manage database connections. Instead of opening and closing a new connection for every request, the pool maintains a set of reusable connections. This drastically improves performance, prevents connection exhaustion under heavy load, and is easily configurable for platforms like NeonDB.

### Why Raw SQL is Used
Using raw SQL (via `pool.query`) provides maximum control and transparency over database interactions. It avoids the performance overhead and "magic" of ORMs, ensuring that every query is strictly optimized. The requirement to avoid `JOIN`s further guarantees predictable and isolated read queries, scaling better for highly distributed systems.

### Authorization Works
Authorization is enforced via the `authorize` middleware and within the service layer:
- **Middlewares**: Protect endpoints by role (e.g., `DELETE /api/issues/:id` is restricted to `maintainer`).
- **Service Layer logic**: When a `contributor` attempts to update an issue, the `issues.service.ts` checks if they are the original reporter and if the issue is still `open`.

---

## Installation

1. **Clone and Install Dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Variables:**
   Copy the `.env.example` contents to a `.env` file and update the `DATABASE_URL` with your PostgreSQL or NeonDB connection string.

3. **Initialize Database Schema:**
   \`\`\`bash
   npm run db:init
   \`\`\`

4. **Start the Development Server:**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Build for Production:**
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

## API Endpoints

### Authentication
- \`POST /api/auth/signup\` - Register a new user
- \`POST /api/auth/login\` - Login and receive JWT

### Issues
- \`POST /api/issues\` - Create a new issue (Auth required)
- \`GET /api/issues\` - Get all issues (Optional query params: \`sort\`, \`type\`, \`status\`)
- \`GET /api/issues/:id\` - Get a single issue by ID
- \`PATCH /api/issues/:id\` - Update an issue (Auth required)
- \`DELETE /api/issues/:id\` - Delete an issue (Maintainer Auth required)

## Deployment Guide (NeonDB + Vercel/Render)

### NeonDB Setup
1. Create a free project on [NeonDB](https://neon.tech/).
2. Copy the Connection String (make sure it includes the password).
3. Append `?sslmode=require` if required by your environment.

### Render / Railway
1. Connect your GitHub repository.
2. Set the build command to `npm install && npm run build`.
3. Set the start command to `npm start`.
4. Add the `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and `PORT` to the Environment Variables settings.
