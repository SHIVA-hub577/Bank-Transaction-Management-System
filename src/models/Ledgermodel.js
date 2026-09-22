const mongoose = require("mongoose");

/**
 * ============================================================================
 * LEDGER MODEL
 * ============================================================================
 * Represents individual entry records in an append-only double-entry ledger.
 * Every financial transaction produces exactly two ledger entries:
 * 1. A DEBIT entry for the paying account.
 * 2. A CREDIT entry for the receiving account.
 * 
 * Immutability Guarantee:
 * Ledger entries are strictly immutable financial audit records.
 * Mongoose middleware hooks enforce that existing entries cannot be updated
 * or deleted once written.
 */

const Ledgerschema = new mongoose.Schema({
    // Account ID associated with this ledger entry
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: true,
        index: true,
        immutable: true
    },
    // Transaction ID that triggered this ledger posting
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required: true,
        index: true,
        immutable: true
    },
    // Monomorphic monetary amount transferred
    amount: {
        type: Number,
        required: true,
        index: true,
        immutable: true
    },
    // Entry type: DEBIT (deduction) or CREDIT (addition)
    type: {
        type: String,
        enum: {
            values: ["CREDIT", "DEBIT"],
            message: "Type is required and must be CREDIT or DEBIT"
        },
        required: true,
        index: true,
        immutable: true
    }
}, {
    timestamps: true // Automatically tracks createdAt and updatedAt
});

/**
 * Middleware function to prevent modification or deletion of ledger entries.
 * Throws an error whenever update/delete operations are attempted.
 */
const preventLedgermodification = function () {
    throw new Error("Ledger entries are immutable and cannot be modified or deleted.");
};

// Register pre-hooks to block any document or query modifications
Ledgerschema.pre("findOneAndUpdate", preventLedgermodification);
Ledgerschema.pre("findOneAndDelete", preventLedgermodification);
Ledgerschema.pre("deleteMany", preventLedgermodification);
Ledgerschema.pre("deleteOne", preventLedgermodification);

const Ledgermodel = mongoose.model("Ledger", Ledgerschema);
module.exports = Ledgermodel;