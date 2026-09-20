# Backend Ledger Project

A Node.js REST API backend for managing ledger accounts, user authentication, and transaction workflows built with Express, MongoDB (Mongoose), and JWT authentication.

---

## Features

- **User Authentication**: Secure user registration and login with password hashing (`bcrypt`) and JWT authentication tokens.
- **Protected Routes**: Middleware (`AuthMiddleware`) verifying JWT token from cookies or Authorization headers.
- **Account Management**: Create and manage financial ledger accounts associated with registered users.
- **Email Notifications**: Asynchronous welcome email integration via Nodemailer.

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
├── server.js               # Application entry point & server launcher
├── package.json            # Dependencies and npm scripts
├── .env                    # Environment variables (Ignored by Git)
├── .gitignore              # Git ignore file
└── src/
    ├── app.js              # Express app initialization & route mounting
    ├── config/
    │   └── db.js           # Database connection configuration
    ├── controllers/
    │   ├── Accountcontroller.js # Ledger account logic
    │   └── Authcontroller.js    # User registration & login logic
    ├── Middleware/
    │   └── authmiddleware.js    # JWT authentication middleware
    ├── models/
    │   ├── Accountmodel.js      # Mongoose schema for ledger accounts
    │   └── usermodel.js         # Mongoose schema for user accounts
    ├── Routes/
    │   ├── AccountRouter.js     # Account management routes
    │   └── Authrouter.js        # Authentication routes
    └── services/
        └── Emailservices.js    # Nodemailer email dispatch services
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

#### Development Mode (with Nodemailer / Nodemon hot-reloading):

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
| `POST` | `/api/user/register` | Register a new user and receive JWT token | No |
| `GET` | `/api/user/login` | Login user with credentials and receive JWT token | No |

### Account Routes (`/api/account`)

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/api/account/` | Create a new ledger account for authenticated user | Yes (`Bearer <token>` or Cookie) |

---

## License

ISC
