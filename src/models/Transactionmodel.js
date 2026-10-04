const mongoose = require("mongoose");

/**
 * ============================================================================
 * TRANSACTION MODEL
 * ============================================================================
 * Represents financial transfer transactions initiated between accounts.
 * Maintains transaction status lifecycle (PENDING -> COMPLETED / FAILED / REVERSED)
 * and enforces strict uniqueness via an idempotency key to prevent double spending.
 */

const transactionschema = new mongoose.Schema({
    // Source account paying the transfer amount
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "fromAccount is required"],
        index: true
    },

    // Destination account receiving the transfer amount
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "toAccount is required"],
        index: true
    },

    // Transaction lifecycle status
    status: {
        type: String,
        enum: {
            values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            message: "Status is required and must be PENDING, COMPLETED, FAILED, or REVERSED"
        },
        default: "PENDING"
    },

    // Transfer amount (must be positive)
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Transaction Amount Cannot be negative"]
    },

    // Unique client-supplied key ensuring idempotency (prevents duplicate processing)
    idempotencykey: {
        type: String,
        required: [true, "idempotencykey is required"],
        unique: true,
        index: true
    }

}, {
    timestamps: true // Automatically manages createdAt and updatedAt timestamps
});

const transactionmodel = mongoose.model("transaction", transactionschema);
module.exports = transactionmodel;