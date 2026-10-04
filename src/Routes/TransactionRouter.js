

const express = require("express");
const transactionrouter = express.Router();
const transactioncontroller = require("../controllers/Transactioncontroller");
const authmiddleware = require("../Middleware/authmiddleware");

/**
 * ============================================================================
 * TRANSACTION ROUTER
 * ============================================================================
 * Defines endpoints for creating ledger transfer transactions.
 * Mounted at `/api/transaction` in app.js.
 */

/**
 * @route   POST /api/transaction/
 * @desc    Initiate and process a financial transfer transaction between accounts
 * @access  Private (Requires valid JWT in cookies or Authorization header)
 */
transactionrouter.post("/", authmiddleware.AuthMiddleware, transactioncontroller.createtransaction);
transactionrouter.get("/get-initial-funds",authmiddleware.authSystemUsermiddleware,transactioncontroller.createInitialFundsTransaction)
module.exports = transactionrouter;
