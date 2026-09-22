const usermodel = require("../models/usermodel");
const accountmodel = require("../models/Accountmodel");

/**
 * ============================================================================
 * ACCOUNT CONTROLLER
 * ============================================================================
 * Handles creation and management of financial accounts associated with users.
 */

/**
 * Create a new financial ledger account for the authenticated user
 * 
 * Route: POST /api/account/
 * Authentication: Required (JWT via AuthMiddleware)
 * 
 * @param {object} req - Express request object containing req.user set by AuthMiddleware
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
exports.CreateAccount = async (req, res, next) => {
    try {
        // Retrieve authenticated user populated by AuthMiddleware
        const user = req.user;

        // Create a new account record linked to the authenticated user ID
        const useraccount = await accountmodel.create({
            user: user._id,
        });

        // Return HTTP 201 Created with created account details
        return res.status(201).json({
            message: "Account created successfully",
            useraccount
        });
    } catch (error) {
        return next(error);
    }
};