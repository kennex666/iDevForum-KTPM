import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const SECRET_KEY = 'your-secret-key'
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token is missing" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
        req.user = { 
            _id: decoded._id, 
            name: decoded.name, 
            role: decoded.role, 
            email: decoded.email, 
        };
        next();
    } catch (err) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
}