const nodemailer = require("nodemailer");

// Create reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLEUSER,
        // Remove spaces if app password was saved with spaces e.g. "abcd efgh ijkl mnop"
        pass: process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, '') : ''
    }
});

/**
 * Send Welcome Email to newly registered user
 * @param {string} toEmail 
 * @param {string} name 
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
        // Return error without breaking user registration flow
        return null;
    }
};

module.exports = {
    sendWelcomeEmail
};
