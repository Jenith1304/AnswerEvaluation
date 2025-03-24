const jwt = require("jsonwebtoken");

const studentMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized. No token found.", success: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.user.role !== "student") {
            return res.status(403).json({ message: "Access denied. Students only.", success: false });
        }
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token", success: false });
    }
};

module.exports = studentMiddleware;
