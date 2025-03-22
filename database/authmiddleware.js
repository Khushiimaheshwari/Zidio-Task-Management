import jwt from "jsonwebtoken";
import BlacklistedToken from "./blacklistModel.js";

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Access denied" });

        const isBlacklisted = await BlacklistedToken.findOne({ token });
        if (isBlacklisted) return res.status(401).json({ error: "Token is invalid (logged out)" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

export default authenticateUser;
