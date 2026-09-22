const accountmodel = require("../models/Accountmodel");
const transactionmodel = require("../models/Transactionmodel");
const Ledgermodel = require("../models/Ledgermodel");
const mongoose = require("mongoose");
const { sendTransactionEmail } = require("../services/Emailservices");

/**
 * ============================================================================
 * TRANSACTION CONTROLLER
 * ============================================================================
 * Handles creation and processing of ledger transactions between accounts.
 * Enforces idempotency, account status checks, balance availability checks,
 * atomic MongoDB transaction sessions, double-entry ledger posting (DEBIT & CREDIT),
 * and email notifications upon successful completion.
 */

/**
 * Create and execute a financial transfer between two accounts
 * 
 * Flow:
 * 1. Validate required payload parameters (fromaccount, toaccount, amount, idempotencykey).
 * 2. Check if accounts exist in the database (with populated user info for emails).
 * 3. Enforce idempotency: prevent duplicate execution if idempotencykey already exists.
 * 4. Verify both accounts have ACTIVE status.
 * 5. Calculate sender account balance using ledger aggregation & verify sufficient funds.
 * 6. Start a MongoDB ACID Session Transaction.
 * 7. Create transaction document in PENDING state.
 * 8. Create DEBIT ledger entry for sender account.
 * 9. Create CREDIT ledger entry for recipient account.
 * 10. Update transaction status to COMPLETED.
 * 11. Commit session & end session atomically.
 * 12. Asynchronously dispatch transaction completion notification email.
 * 13. Return HTTP 200 response with completed transaction details.
 */
exports.createtransaction = async (req, res, next) => {
    try {
        const { fromaccount, toaccount, amount, idempotencykey } = req.body;

        // Step 1: Validate payload parameters
        if (!fromaccount || !toaccount || !amount || !idempotencykey) {
            return res.status(400).json({
                message: "All details (fromaccount, toaccount, amount, idempotencykey) are required."
            });
        }

        // Step 2: Retrieve source and target account documents along with user profile info
        const fromuseraccount = await accountmodel.findById(fromaccount).populate("user");
        const touseraccount = await accountmodel.findById(toaccount).populate("user");

        if (!fromuseraccount || !touseraccount) {
            return res.status(404).json({
                message: "Invalid account details. One or both accounts do not exist."
            });
        }

        // Step 3: Check Idempotency Key to prevent duplicate processing
        const istransactionexists = await transactionmodel.findOne({ idempotencykey });
        if (istransactionexists) {
            if (istransactionexists.status === "COMPLETED") {
                return res.status(200).json({
                    message: "Transaction already completed.",
                    transaction: istransactionexists
                });
            }
            if (istransactionexists.status === "FAILED") {
                return res.status(400).json({
                    message: "Transaction failed previously and cannot be retried."
                });
            }
            if (istransactionexists.status === "REVERSED") {
                return res.status(400).json({
                    message: "Transaction was reversed and cannot be retried."
                });
            }
            if (istransactionexists.status === "PENDING") {
                return res.status(409).json({
                    message: "Transaction already exists and is currently in PENDING state."
                });
            }
        }

        // Step 4: Ensure both accounts are active for transfers
        if (fromuseraccount.status !== 'ACTIVE' || touseraccount.status !== 'ACTIVE') {
            return res.status(400).json({
                message: "One or both accounts are not in ACTIVE state."
            });
        }

        // Step 5: Check sender account balance from ledger double-entry calculation
        const fromaccountbalance = await fromuseraccount.getbalance();
        if (fromaccountbalance < amount) {
            return res.status(403).json({
                message: `Insufficient balance. Available: ${fromaccountbalance}, Requested: ${amount}`
            });
        }

        // Step 6: Begin atomic Mongoose database session
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Step 7: Create initial transaction record
            const transaction = await transactionmodel.create([{
                fromAccount: fromaccount,
                toAcccount: toaccount,
                amount: amount,
                idempotencykey: idempotencykey,
                status: "PENDING"
            }], { session });

            const createdTransaction = transaction[0];

            // Step 8: Post DEBIT entry for sender account
            await Ledgermodel.create([{
                account: fromaccount,
                amount: amount,
                transactionId: createdTransaction._id,
                type: "DEBIT"
            }], { session });

            // Step 9: Post CREDIT entry for recipient account
            await Ledgermodel.create([{
                account: toaccount,
                amount: amount,
                transactionId: createdTransaction._id,
                type: "CREDIT"
            }], { session });

            // Step 10: Mark transaction status as COMPLETED
            createdTransaction.status = "COMPLETED";
            await createdTransaction.save({ session });

            // Step 11: Commit database session transaction
            await session.commitTransaction();
            session.endSession();

            // Step 12: Dispatch transaction email notification asynchronously in background
            const senderEmail = fromuseraccount.user ? fromuseraccount.user.email : null;
            const receiverEmail = touseraccount.user ? touseraccount.user.email : null;
            const senderName = fromuseraccount.user ? fromuseraccount.user.name : "Valued Customer";
            const receiverName = touseraccount.user ? touseraccount.user.name : "Valued Customer";

            sendTransactionEmail({
                transactionId: createdTransaction._id.toString(),
                amount: amount,
                fromAccountId: fromaccount.toString(),
                toAccountId: toaccount.toString(),
                idempotencyKey: idempotencykey
            }, senderEmail, receiverEmail, senderName, receiverName);

            // Step 13: Respond to client with success payload
            return res.status(200).json({
                message: "Transaction completed successfully",
                transaction: createdTransaction
            });

        } catch (error) {
            // If any error occurs inside transaction session, abort all uncommitted writes
            await session.abortTransaction();
            session.endSession();
            throw error;
        }

    } catch (error) {
        // Forward error to Express error handler middleware
        return next(error);
    }
};