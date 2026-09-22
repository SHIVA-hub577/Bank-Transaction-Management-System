# Backend Ledger Project

A Node.js REST API backend for managing double-entry ledger accounts, user authentication, and atomic transaction workflows built with Express, MongoDB (Mongoose), and JWT authentication.

---

## Features

- **User Authentication**: Secure user registration and login with password hashing (`bcrypt`) and JWT authentication tokens.
- **Protected Routes**: Middleware (`AuthMiddleware`) verifying JWT token from cookies or Authorization headers.
- **Account Management**: Create and manage financial ledger accounts associated with registered users.
- **Double-Entry Ledger Engine**: Immutable DEBIT/CREDIT ledger postings with dynamic balance calculation via MongoDB Aggregation Framework.
- **Atomic Transactions**: Multi-document MongoDB ACID sessions enforcing idempotency keys to prevent duplicate transactions.
- **Email Notifications**: Asynchronous welcome email and transaction completion notifications via Nodemailer (Gmail SMTP).

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (v5)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & Cookie Parser
- **Security**: Password hashing (`bcrypt` / `bcryptjs`)
- **Emailing**: Nodemailer

---

## Project Structure

```text
Backend-ledger-project/
├── server.js                        # Application entry point & server launcher
├── package.json                     # Dependencies and npm scripts
├── .env                             # Environment variables (Ignored by Git)
├── .gitignore                       # Git ignore file
├── AGENTS.md                        # Project workspace rules
└── src/
    ├── app.js                       # Express app initialization & route mounting
    ├── config/
    │   └── db.js                    # Database connection configuration
    ├── controllers/
    │   ├── Accountcontroller.js     # Ledger account creation logic
    │   ├── Authcontroller.js        # User registration & login logic
    │   └── Transactioncontroller.js # Transfer execution, idempotency & email dispatch
    ├── Middleware/
    │   └── authmiddleware.js        # JWT authentication middleware
    ├── models/
    │   ├── Accountmodel.js          # Account schema & balance aggregation method
    │   ├── Ledgermodel.js           # Immutable double-entry ledger schema
    │   ├── Transactionmodel.js      # Transaction state machine schema & idempotency
    │   └── usermodel.js             # User schema & password hashing methods
    ├── Routes/
    │   ├── AccountRouter.js         # Account management routes
    │   ├── Authrouter.js            # Authentication routes
    │   └── TransactionRouter.js     # Transaction routes
    └── services/
        └── Emailservices.js         # Nodemailer email dispatch services (Welcome & Transaction alerts)
```

---

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB Database (Local instance or MongoDB Atlas cluster)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Backend-ledger-project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/Backend-Ledger
JWT_SECRET=your_jwt_secret_key_here
GOOGLEUSER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
```

> ⚠️ **Important**: Never commit your `.env` file to version control.

### 4. Run the Application

#### Development Mode (with Nodemon hot-reloading):

```bash
npm run dev
```

#### Production Mode:

```bash
npm start
```

The server will start at `http://localhost:3005`.

---

## API Documentation

### Authentication Routes (`/api/user`)

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/api/user/register` | Register a new user and receive JWT token + Welcome Email | No |
| `POST` / `GET` | `/api/user/login` | Login user with credentials and receive JWT token | No |

### Account Routes (`/api/account`)

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/api/account/` | Create a new ledger account for authenticated user | Yes (`Bearer <token>` or Cookie) |

### Transaction Routes (`/api/transaction`)

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/api/transaction/` | Process a transfer between accounts, post ledger entries, and send confirmation email | Yes (`Bearer <token>` or Cookie) |

#### Request Payload for `POST /api/transaction/`:

```json
{
  "fromaccount": "651a2b3c4d5e6f7a8b9c0d1e",
  "toaccount": "651a2b3c4d5e6f7a8b9c0d1f",
  "amount": 500,
  "idempotencykey": "unique-uuid-v4-key-12345"
}
```

---

## License

ISC

