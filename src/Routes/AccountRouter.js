const express = require("express");
const accountrouter = express.Router();
const accountcontroller = require("../controllers/Accountcontroller");
const AuthMiddleware = require("../Middleware/authmiddleware");

/**
 * ============================================================================
 * ACCOUNT ROUTER
 * ============================================================================
 * Defines management endpoints for user financial accounts.
 * Mounted at `/api/account` in app.js.
 */

/**
 * @route   POST /api/account/
 * @desc    Create a new ledger account for the authenticated user
 * @access  Private (Requires valid JWT in cookies or Authorization header)
 */
accountrouter.post("/", AuthMiddleware.AuthMiddleware, accountcontroller.CreateAccount);

module.exports = accountrouter;