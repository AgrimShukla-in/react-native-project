import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


const authMiddleware = async (req, res, next) => {
    try {
  
        const token = req.cookies?.accessToken || req.header("Authorization").replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_ACSSES_TOKEN);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("error in auth middleware" + error);
        res.status(401).json({ message: "Unauthorized" });
    }
};

export default authMiddleware;