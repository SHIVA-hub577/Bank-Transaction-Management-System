require("dotenv").config();
const express = require("express");
const cookie = require("cookie-parser");

const authrouter = require("../src/Routes/Authrouter");
const accountrouter = require("../src/Routes/AccountRouter");
const transactionrouter = require("../src/Routes/TransactionRouter");

/**
 * ============================================================================
 * EXPRESS APPLICATION INITIALIZATION
 * ============================================================================
 * Configures global middleware (JSON parser, cookie parser) and mounts API routes.
 */

const app = express();

// Middleware: Parse JSON request bodies
app.use(express.json());

// Middleware: Parse incoming cookies for JWT authentication
app.use(cookie());

// Route Mounting
app.use("/api/user", authrouter);
app.use("/api/account", accountrouter);
app.use("/api/transaction", transactionrouter);

module.exports = app;