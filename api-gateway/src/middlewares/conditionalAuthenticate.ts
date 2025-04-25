import { authenticate } from "./authenticate";
import { Request, Response, NextFunction } from "express";

export function conditionalAuthenticate(methods: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log("Request method:", req.method);
        if(methods.includes(req.method.toUpperCase())) {
            return authenticate(req, res, next);
        }
        next();
    };
}
export default conditionalAuthenticate;