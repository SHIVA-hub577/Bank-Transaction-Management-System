const jwt = require("jsonwebtoken");
const usermodel = require("../models/usermodel");
const tokenblacklistedmodel=require("../models/Tokenblacklistmodel");
/**
 * ============================================================================
 * AUTHENTICATION MIDDLEWARE
 * ============================================================================
 * Protects private API endpoints by extracting and validating JSON Web Tokens (JWT).
 * Supports token extraction from HTTP cookies (`req.cookies.token`) or 
 * HTTP Bearer Authorization headers (`Authorization: Bearer <token>`).
 * 
 * If valid, fetches user document and attaches it to `req.user`.
 * If missing or invalid, returns HTTP 401 Unauthorized response.
 */
exports.AuthMiddleware = async (req, res, next) => {
    // Extract token from request cookie OR Authorization bearer header
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    // Check if token is missing
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access. Authentication token is missing."
        });
    }

    const isblacklisted=await tokenblacklistedmodel.findOne({token:token});

    if(isblacklisted){
        return res.status(400).json({
            message:"Invalid token,user logged out"
        })
    }

    try {
        // Verify JWT signature using secret key
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // Retrieve user details from database using decoded user ID
        const user = await usermodel.findById(decode.userId);
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized access. User account no longer exists."
            });
        }

        // Attach authenticated user object to request for downstream controller handlers
        req.user = user;
        return next();
    } catch (error) {
        // Token invalid, expired, or tampered with
        return res.status(401).json({
            message: "Unauthorized access. Invalid or expired token."
        });
    }
};


exports.authSystemUsermiddleware=async (req,res,next)=>{
    // Extract token from request cookie OR Authorization bearer header
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    // Check if token is missing
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access. Authentication token is missing."
        });
    }
     const isblacklisted=await tokenblacklistedmodel.findOne({token:token});

    if(isblacklisted){
        return res.status(400).json({
            message:"Invalid token,user logged out"
        })
    }

    try {
        // Verify JWT signature using secret key
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // Retrieve user details from database using decoded user ID
        const User = await usermodel.findById(decode.userId).select("+SystemUser");
        if (!User || !User.SystemUser) {
            return res.status(403).json({
                message: "Unauthorized access. Not a System User"
            });
        }

        // Attach authenticated user object to request for downstream controller handlers
        req.user = User;
        return next();
    } catch (error) {
        // Token invalid, expired, or tampered with
        return res.status(401).json({
            message: "Unauthorized access. Invalid or expired token."
        });
    }
}
