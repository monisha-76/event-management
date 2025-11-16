import jwt from "jsonwebtoken";

// Middleware: Check if user is authenticated (UPDATED to read from req.cookies)
export const authRequired = (req, res, next) => {
    // Check for the token in the HttpOnly cookie set by the login controller.
    // This requires 'cookie-parser' middleware to be active in server.js.
    const token = req.cookies.token; 

    if (!token) {
        // 401 Unauthorized: No token found
        return res.status(401).json({ message: "Not authorized, session token missing" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Store the decoded user data (id and role) in the request
        req.user = decoded; 
        
        next();
    } catch (err) {
        // 401 Unauthorized: Token is invalid or expired
        return res.status(401).json({ message: "Not authorized, token failed or expired" });
    }
};

// Middleware: Check if user role is allowed (No change needed)
export const roleRequired = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user is populated by the authRequired middleware
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: Session data missing" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            // 403 Forbidden: User role is not allowed
            return res.status(403).json({ 
                message: `Access denied. Role (${req.user.role}) not authorized for this action.` 
            });
        }

        next();
    };
};