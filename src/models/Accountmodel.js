const mongoose = require("mongoose");
const ledgermodel = require("./Ledgermodel");

/**
 * ============================================================================
 * ACCOUNT MODEL
 * ============================================================================
 * Represents a user's financial account in the ledger system.
 * Rather than storing a mutable balance field, account balance is derived
 * dynamically from immutable double-entry ledger records (CREDIT vs DEBIT).
 */

const accountSchema = new mongoose.Schema({
    // User associated with this financial account
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Account must be associated with a user"],
        index: true
    },
    // Account state: ACTIVE (normal operations), INACTIVE, or FROZEN (blocked transactions)
    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "INACTIVE", "FROZEN"],
            message: "Status must be either ACTIVE, INACTIVE or FROZEN"
        },
        default: "ACTIVE"
    },
    // Operating currency (defaults to INR)
    currency: {
        type: String,
        required: [true, "Currency is required"],
        default: "INR"
    }
}, {
    timestamps: true // Tracks account creation and update dates
});

// Compound index on user and status for fast account lookup by state
accountSchema.index({ user: 1, status: 1 });

/**
 * Instance Method: getbalance
 * 
 * Computes current available balance dynamically using MongoDB Aggregation Pipeline over
 * all immutable ledger entries associated with this account ID.
 * 
 * Aggregation Steps:
 * 1. $match: Filter ledger documents belonging to this account (`account: this._id`).
 * 2. $group: Sum total credits and total debits using conditional `$cond`.
 * 3. $project: Compute net balance as (`totalcredit` - `totaldebit`).
 * 
 * @returns {Promise<number>} Current calculated balance (or 0 if no transactions exist)
 */
accountSchema.methods.getbalance = async function () {
    const balancedata = await ledgermodel.aggregate([
        // Step 1: Match ledger entries for this account
        { $match: { account: this._id } },

        // Step 2: Group and sum CREDITs and DEBITs
        {
            $group: {
                _id: null,
                totalcredit: {
                    $sum: {
                        $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0]
                    }
                },
                totaldebit: {
                    $sum: {
                        $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0]
                    }
                }
            }
        },

        // Step 3: Project net balance (Total Credits minus Total Debits)
        {
            $project: {
                balance: { $subtract: ["$totalcredit", "$totaldebit"] }
            }
        }
    ]);

    // If no ledger entries exist, return 0 balance
    if (balancedata.length === 0) {
        return 0;
    }

    return balancedata[0].balance;
};

const accountmodel = mongoose.model("account", accountSchema);
module.exports = accountmodel;