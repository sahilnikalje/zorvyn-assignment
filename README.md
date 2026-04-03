# Finance Tracker API

A RESTful backend API for managing financial transactions with role-based access control, built with Node.js, Express, and MongoDB.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB with Mongoose
- **Auth:** JWT (jsonwebtoken + bcryptjs)
- **Rate Limiting:** express-rate-limit

---

## Project Structure

```
Backend/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── transactionController.js
│   └── dashboardController.js
├── middlewares/
│   ├── authMiddleware.js
│   ├── rolesMiddleware.js
│   └── rateLimiter.js
├── models/
│   ├── userSchema.js
│   └── transactionSchema.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── transactionRoutes.js
│   └── dashboardRoutes.js
└── server.js
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/sahilnikalje/zorvyn-assignment.git
cd Backend
npm install
```

### Environment Variables

Create a `.env` file in the root:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Running the Server

```bash
# Development
nodemon server.js

# Production
node server.js
```

Server runs on `http://localhost:3000`. Verify with `GET /server`.

---

## Roles and Permissions

| Action | Viewer | Analyst | Admin |
|---|:---:|:---:|:---:|
| View transactions | ✅ | ✅ | ✅ |
| Create / Update / Delete transactions | ❌ | ❌ | ✅ |
| View dashboard (summary, trends, categories) | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

Default role for new users is `viewer`.

---

## API Reference

All protected routes require:
```
Authorization: Bearer <token>
```

---

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and get token |
| GET | `/api/auth/me` | All | Get current user |

**Register body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "viewer"
}
```

**Login body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

---

### Transactions — `/api/transactions`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/transactions` | All | Get all transactions |
| GET | `/api/transactions/:id` | All | Get single transaction |
| POST | `/api/transactions` | Admin | Create transaction |
| PUT | `/api/transactions/:id` | Admin | Update transaction |
| DELETE | `/api/transactions/:id` | Admin | Soft delete transaction |

**Query params for GET `/api/transactions`:**

| Param | Description |
|---|---|
| `type` | `income` or `expense` |
| `category` | Partial match |
| `startDate` | From date (ISO format) |
| `endDate` | To date (ISO format) |
| `search` | Search in notes and category |
| `page` | Page number (default: 1) |
| `limit` | Results per page (default: 10) |

**Create/Update body:**
```json
{
  "amount": 5000,
  "type": "income",
  "category": "Salary",
  "date": "2024-06-01",
  "notes": "Monthly salary"
}
```

> Delete is a soft delete — sets `isDeleted: true` and records `deletedAt`. Data is never permanently removed.

---

### Dashboard — `/api/dashboard`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/dashboard/summary` | Analyst, Admin | Total income, expenses, net balance |
| GET | `/api/dashboard/category-totals` | Analyst, Admin | Totals grouped by category |
| GET | `/api/dashboard/monthly-trends` | Analyst, Admin | Monthly income vs expense |
| GET | `/api/dashboard/recent` | Analyst, Admin | Recent transactions |

**Query params:**

| Endpoint | Param | Description |
|---|---|---|
| `/category-totals` | `type` | Filter by `income` or `expense` |
| `/monthly-trends` | `year` | Year (default: current year) |
| `/recent` | `limit` | Number of results (default: 5) |

---

### Users — `/api/users` (Admin only)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get single user |
| PATCH | `/api/users/:id/role` | Update user role |
| PATCH | `/api/users/:id/status` | Activate or deactivate user |

**Query params for GET `/api/users`:**

| Param | Description |
|---|---|
| `role` | Filter by role |
| `status` | `active` or `inactive` |
| `page` | Default: 1 |
| `limit` | Default: 10 |

**Role update body:**
```json
{ "role": "analyst" }
```

**Status update body:**
```json
{ "status": "inactive" }
```

> Admins cannot change their own role or status.

---

## Rate Limiting

All routes are limited to **100 requests per 15 minutes** per IP.

```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

---

## Error Format

All errors return a consistent structure:

```json
{
  "success": false,
  "message": "Description of the error"
}
```

| Status | Meaning |
|---|---|
| 400 | Bad request or missing fields |
| 401 | Missing or invalid token |
| 403 | Insufficient role or inactive account |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Server error |

---

## Assumptions

1. Any role can be set at registration to keep testing simple.
2. Viewers can read transactions but cannot access dashboard analytics.
3. Transactions are soft deleted only — never permanently removed.
4. Admins cannot modify their own role or status to prevent accidental lockout.
