import jwt from "jsonwebtoken";
export async function authenticate(req, res, next) {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({
                message: "Please login",
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.userId,
            role: decoded.role,
        };
        next();
    }
    catch (err) {
        console.error("AUTHENTICATION ERROR:", err);
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}
