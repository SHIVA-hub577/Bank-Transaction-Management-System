const usermodel = require("../models/usermodel");
const Jwt = require("jsonwebtoken");
const { sendWelcomeEmail } = require("../services/Emailservices");
const tokenblacklistmodel=require("../models/Tokenblacklistmodel");
/**
 * ============================================================================
 * AUTHENTICATION CONTROLLER
 * ============================================================================
 * Manages user onboarding (registration) and authentication (login).
 * Handles password validation, JWT generation, secure cookie setting,
 * and asynchronous welcome email triggers.
 */

/**
 * Register a new user account
 * 
 * Route: POST /api/user/register
 * 
 * @param {object} req - Express request object containing email, name, password
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
exports.userpostregister = async (req, res, next) => {
    try {
        const { email, name, password } = req.body;

        // Step 1: Check if email is already registered in the system
        const isExists = await usermodel.findOne({ email });
        if (isExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email address."
            });
        }

        // Step 2: Create new user document (password is hashed automatically by pre-save hook in usermodel.js)
        const user = await usermodel.create({ email, name, password });

        // Step 3: Trigger welcome email notification asynchronously (does not block registration response)
        sendWelcomeEmail(user.email, user.name);

        // Step 4: Generate JWT token valid for 3 days signed with JWT_SECRET secret key
        const token = await Jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        // Step 5: Attach authentication JWT token into an HTTP-only secure cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
        });

        // Step 6: Return HTTP 201 Created status with user object and JWT token
        res.status(201).json({
            message: "User registered successfully",
            user: {
                userid: user._id,
                email: user.email,
                name: user.name
            },
            token
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * Authenticate existing user and issue access token
 * 
 * Route: GET /api/user/login (or POST /api/user/login)
 * 
 * @param {object} req - Express request object containing email, password
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
exports.userlogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Step 1: Find user by email (explicitly include +password field since select: false in schema)
        const user = await usermodel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials. User not found."
            });
        }

        // Step 2: Compare input password against stored bcrypt hash using instance method
        const isMatched = await user.comparepassword(password);
        if (!isMatched) {
            return res.status(401).json({
                message: "Invalid credentials. Password incorrect."
            });
        }

        // Step 3: Generate JWT token valid for 3 days
        const token = await Jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        // Step 4: Attach token to response cookie
        res.cookie("token", token);

        // Step 5: Return HTTP 200/201 success response with user profile details & token
        res.status(200).json({
            message: "User logged in successfully",
            user: {
                userid: user._id,
                email: user.email,
                name: user.name
            },
            token
        });
    } catch (error) {
        return next(error);
    }
};


exports.userlogout=async (req,res,next)=>{
    const token=req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(400).json({
            message:"No token exists,to logout"
        })
    }
    const tokenblacklist=await tokenblacklistmodel.create({token:token});
    res.clearCookie("token");
    return res.status(200).json({
        message:"User logged out successfully",
        tokenblacklist
    });
}