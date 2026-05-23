# DevPulse Backend 💻🚀

DevPulse is a professional internal tech issue and feature tracker API designed for software development teams to report bugs, suggest features, coordinate resolutions, and track development velocity.

This application is built with a strict **3-Layer Architecture** (Routes -> Controllers -> Services) using **Node.js, Express, and TypeScript**, interacting with **PostgreSQL** via high-performance raw queries (no ORM) and connection pooling.

---

## Live API

🔗 **Live Deployment URL:** [https://devpulse-liart.vercel.app/](https://devpulse-liart.vercel.app/)

---

## Features

- **JWT Authentication:** Secure user authentication and token-based state verification.
- **Bug & Feature Tracking:** Comprehensive bug reporting and feature request lifecycle tracking.
- **Role-Based Access Control (RBAC):** Distinct permissions enforced for `contributor` and `maintainer` roles.
- **High-Performance Database Queries:** Uses direct PostgreSQL connection pooling and raw SQL JOIN queries (no ORM) for maximum speed.
- **Robust Error Handling:** Centralized Express error handler to manage validation, duplicate keys, and authorization issues gracefully.

---

## Tech Stack

- **Runtime:** Node.js (LTS v24+)
- **Web Framework:** Express.js (v5)
- **Programming Language:** TypeScript (Strict Mode)
- **Database:** PostgreSQL (using connection pooling via `pg` driver, raw SQL, no ORM)
- **Security:** JWT (JSON Web Tokens) & `bcrypt` password hashing

---

## Setup

Follow these steps to set up the project locally on your machine:

### 1. Clone the repository
```bash
git clone https://github.com/Tizul-Islam/B7A2.git
cd B7A2
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and configure the following parameters:
```env
PORT=5000
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database_name]?sslmode=disable
JWT_SECRET=your_long_random_jwt_secret_key
JWT_EXPIRES_IN=7d
```

### 4. Initialize Database Schema
Run the migration script to automatically create database tables with correct constraints:
```bash
npm run db:init
```

### 5. Start Development Server
```bash
npm run dev
```

---

## API Endpoints

### 🔑 Authentication Endpoints
| HTTP Method | Endpoint | Description | Auth Required | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/signup` | Register a new user | No | `{ name, email, password, role }` |
| **POST** | `/api/auth/login` | User login (returns JWT) | No | `{ email, password }` |

### 🐛 Issues Endpoints
| HTTP Method | Endpoint | Description | Auth Required | Query / Request Body |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/issues` | Create a new issue | Yes (Any role) | `{ title, description, type }` |
| **GET** | `/api/issues` | Get all issues with filters/sorting | No | Query Params: `sort`, `type`, `status` |
| **GET** | `/api/issues/:id` | Get issue details by ID | No | None |
| **PATCH** | `/api/issues/:id` | Update issue details | Yes (Any role) | `{ title, description, type, status }` |
| **DELETE** | `/api/issues/:id` | Delete an issue | Yes (Maintainer) | None |

---

## Database Schema

The database consists of two tables: `users` and `issues`.

### 👥 User Schema (`users` Table)
| Column Name | Data Type | Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | *Auto-increment* | Unique identifier |
| `name` | `VARCHAR(255)` | `NOT NULL` | - | User's full name |
| `email` | `VARCHAR(255)` | `UNIQUE`, `NOT NULL` | - | User's login email |
| `password` | `VARCHAR(255)` | `NOT NULL` | - | Hashed password |
| `role` | `VARCHAR(50)` | `CHECK (role IN ('contributor', 'maintainer'))` | `'contributor'` | Role for access control |
| `created_at` | `TIMESTAMP` | `WITH TIME ZONE` | `CURRENT_TIMESTAMP` | Account creation timestamp |
| `updated_at` | `TIMESTAMP` | `WITH TIME ZONE` | `CURRENT_TIMESTAMP` | Last updated timestamp |

### 🛠️ Issue Schema (`issues` Table)
| Column Name | Data Type | Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | *Auto-increment* | Unique identifier |
| `title` | `VARCHAR(150)` | `NOT NULL` | - | Brief summary of the issue |
| `description` | `TEXT` | `NOT NULL` | - | Detailed explanation |
| `type` | `VARCHAR(50)` | `CHECK (type IN ('bug', 'feature_request'))` | - | Classification of issue |
| `status` | `VARCHAR(50)` | `CHECK (status IN ('open', 'in_progress', 'resolved'))` | `'open'` | Lifecycle state |
| `reporter_id` | `INTEGER` | `NOT NULL`, `REFERENCES users(id)` | - | User who reported the issue |
| `created_at` | `TIMESTAMP` | `WITH TIME ZONE` | `CURRENT_TIMESTAMP` | Issue creation timestamp |
| `updated_at` | `TIMESTAMP` | `WITH TIME ZONE` | `CURRENT_TIMESTAMP` | Last updated timestamp |
