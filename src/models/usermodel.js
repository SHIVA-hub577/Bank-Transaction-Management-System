const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * ============================================================================
 * USER MODEL
 * ============================================================================
 * Defines user account schema including credentials, validation rules,
 * password hashing middleware, and password authentication methods.
 */

const userschema = new mongoose.Schema({
    // User email address (unique identifier for authentication)
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email is already registered"],
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
    },

    // User display name
    name: {
        type: String,
        required: [true, "Username is required"],
        trim: true
    },

    // Hashed password string (hidden by default on queries via select: false)
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password should have minimum length of 6 characters"],
        select: false // Excludes password from query results unless explicitly selected using +password
    }

}, {
    timestamps: true // Tracks user creation and last modification timestamps
});

/**
 * Pre-Save Middleware Hook
 * 
 * Automatically hashes the user password using bcrypt before saving to MongoDB
 * if the password field was modified or newly set.
 */
userschema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    // Hash plain text password with salt factor of 10
    this.password = await bcrypt.hash(this.password, 10);
    return;
});

/**
 * Instance Method: comparepassword
 * 
 * Compares an incoming plain-text password against the user's stored bcrypt hash.
 * 
 * @param {string} candidatePassword - Password string submitted during login
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
userschema.methods.comparepassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Usermodel = mongoose.model('user', userschema);
module.exports = Usermodel;