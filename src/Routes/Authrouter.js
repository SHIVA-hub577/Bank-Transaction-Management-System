const express = require("express");
const authrouter = express.Router();
const authcontroller = require("../controllers/Authcontroller");

/**
 * ============================================================================
 * AUTHENTICATION ROUTER
 * ============================================================================
 * Defines endpoints for user registration and authentication.
 * Mounted at `/api/user` in app.js.
 */

/**
 * @route   POST /api/user/register
 * @desc    Register a new user, issue JWT token, and dispatch welcome email
 * @access  Public
 */
authrouter.post("/register", authcontroller.userpostregister);

/**
 * @route   POST /api/user/login (also supports GET)
 * @desc    Authenticate user credentials and issue JWT token
 * @access  Public
 */
authrouter.post("/login", authcontroller.userlogin);
authrouter.get("/login", authcontroller.userlogin);


authrouter.get("/logout",authcontroller.userlogout);

module.exports = authrouter;
