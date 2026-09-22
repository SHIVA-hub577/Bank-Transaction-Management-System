const nodemailer = require("nodemailer");

/**
 * ============================================================================
 * EMAIL SERVICE MODULE
 * ============================================================================
 * This service handles all outgoing email communications for the application
 * using Nodemailer. It configures a reusable SMTP transport (Gmail) and
 * provides helper functions for welcome emails and transaction alerts.
 */

// Create a reusable Nodemailer transporter instance configured for Gmail SMTP.
// Credentials are loaded from environment variables (.env).
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        // Sender Gmail address (e.g. user@gmail.com)
        user: process.env.GOOGLEUSER,
        // Google App Password (16-character token, spaces automatically stripped if present)
        pass: process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, '') : ''
    }
});

/**
 * Send Welcome Email to newly registered user
 * 
 * @param {string} toEmail - Recipient's email address
 * @param {string} name - Recipient's display name
 * @returns {Promise<object|null>} Nodemailer info object on success, or null on error
 */
const sendWelcomeEmail = async (toEmail, name) => {
    try {
        const mailOptions = {
            from: `"Backend-Ledger" <${process.env.GOOGLEUSER}>`,
            to: toEmail,
            subject: "Welcome to Backend-Ledger! 🎉",
            text: `Hello ${name},\n\nWelcome to Backend-Ledger! We're thrilled to have you on board.\nHave a great day!\n\nBest regards,\nThe Backend-Ledger Team`,
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #1e293b;">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #334155;">
                    <h1 style="color: #38bdf8; margin: 0; font-size: 28px; font-weight: 700;">Backend-Ledger</h1>
                </div>
                <div style="padding: 24px 0;">
                    <h2 style="color: #f1f5f9; margin-top: 0;">Welcome, ${name}! 👋</h2>
                    <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">
                        Thank you for registering with <strong>Backend-Ledger</strong>. We are thrilled to have you join us!
                    </p>
                    <div style="background-color: #1e293b; padding: 18px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #38bdf8;">
                        <p style="margin: 0; font-size: 15px; color: #e2e8f0; font-style: italic;">
                            "Managing transactions and ledgers made simple, secure, and seamless."
                        </p>
                    </div>
                    <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">
                        Have a great day ahead! If you have any questions or need support, feel free to reach out to us anytime.
                    </p>
                </div>
                <div style="text-align: center; padding-top: 20px; border-top: 1px solid #334155; color: #64748b; font-size: 13px;">
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} Backend-Ledger. All rights reserved.</p>
                </div>
            </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Welcome email sent successfully to %s (Message ID: %s)", toEmail, info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending welcome email to %s:", toEmail, error);
        // Fail gracefully without interrupting main request flow
        return null;
    }
};

/**
 * Send Transaction Completion Notification Email to sender and/or receiver
 * 
 * @param {object} transactionDetails - Information about the completed transaction
 * @param {string} transactionDetails.transactionId - Transaction MongoDB ID
 * @param {number} transactionDetails.amount - Amount transferred
 * @param {string} transactionDetails.fromAccountId - Sender Account ID
 * @param {string} transactionDetails.toAccountId - Receiver Account ID
 * @param {string} transactionDetails.idempotencyKey - Transaction idempotency key
 * @param {string} [senderEmail] - Email address of the account sender
 * @param {string} [receiverEmail] - Email address of the account recipient
 * @param {string} [senderName] - Name of the sender
 * @param {string} [receiverName] - Name of the recipient
 */
const sendTransactionEmail = async ({ transactionId, amount, fromAccountId, toAccountId, idempotencyKey }, senderEmail, receiverEmail, senderName = "Valued Customer", receiverName = "Valued Customer") => {
    try {
        const recipients = [senderEmail, receiverEmail].filter(Boolean);
        if (recipients.length === 0) {
            console.log("No valid email addresses provided for transaction notification (%s)", transactionId);
            return null;
        }

        const mailOptions = {
            from: `"Backend-Ledger Alerts" <${process.env.GOOGLEUSER}>`,
            to: recipients.join(", "),
            subject: `Transaction Successful - ${amount} INR [ID: ${transactionId}]`,
            text: `Hello,\n\nA transaction of ${amount} INR has been successfully completed.\n\nDetails:\n- Transaction ID: ${transactionId}\n- From Account: ${fromAccountId}\n- To Account: ${toAccountId}\n- Amount: ${amount} INR\n- Status: COMPLETED\n- Reference (Idempotency Key): ${idempotencyKey}\n\nThank you for using Backend-Ledger!`,
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #1e293b;">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #334155;">
                    <h1 style="color: #38bdf8; margin: 0; font-size: 26px; font-weight: 700;">Backend-Ledger</h1>
                    <p style="color: #22c55e; margin: 5px 0 0 0; font-weight: 600; font-size: 14px;">✔ TRANSACTION COMPLETED</p>
                </div>
                <div style="padding: 24px 0;">
                    <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">
                        A financial transfer of <strong>${amount} INR</strong> has been successfully processed and posted to the ledger.
                    </p>
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #1e293b; border-radius: 8px; overflow: hidden;">
                        <tr style="border-bottom: 1px solid #334155;">
                            <td style="padding: 12px 16px; color: #94a3b8; font-size: 14px;">Transaction ID</td>
                            <td style="padding: 12px 16px; color: #f8fafc; font-size: 14px; font-weight: 600; text-align: right;">${transactionId}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #334155;">
                            <td style="padding: 12px 16px; color: #94a3b8; font-size: 14px;">Amount Transferred</td>
                            <td style="padding: 12px 16px; color: #38bdf8; font-size: 16px; font-weight: 700; text-align: right;">${amount} INR</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #334155;">
                            <td style="padding: 12px 16px; color: #94a3b8; font-size: 14px;">Sender Account</td>
                            <td style="padding: 12px 16px; color: #f8fafc; font-size: 13px; font-family: monospace; text-align: right;">${fromAccountId}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #334155;">
                            <td style="padding: 12px 16px; color: #94a3b8; font-size: 14px;">Recipient Account</td>
                            <td style="padding: 12px 16px; color: #f8fafc; font-size: 13px; font-family: monospace; text-align: right;">${toAccountId}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 16px; color: #94a3b8; font-size: 14px;">Idempotency Key</td>
                            <td style="padding: 12px 16px; color: #cbd5e1; font-size: 13px; text-align: right;">${idempotencyKey}</td>
                        </tr>
                    </table>
                </div>
                <div style="text-align: center; padding-top: 20px; border-top: 1px solid #334155; color: #64748b; font-size: 13px;">
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} Backend-Ledger system alert. Please do not reply directly to this automated email.</p>
                </div>
            </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Transaction completion email sent successfully to %s (Message ID: %s)", recipients.join(", "), info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending transaction completion email:", error);
        // Return null to avoid breaking user response flow
        return null;
    }
};

module.exports = {
    sendWelcomeEmail,
    sendTransactionEmail
};

