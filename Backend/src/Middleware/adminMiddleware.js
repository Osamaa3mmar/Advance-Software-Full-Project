export const adminMiddleware = (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized. User not found." });
        }

        if (user.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden. Admins only." });
        }

        next(); 
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};