const SECRET_KEY = "your-secret-key"; // Replace with your actual secret key
import jwt from "jsonwebtoken";
import { v4 } from 'uuid';

const jwtOptions = {
    algorithm: "HS256",
    expiresIn: "1w",
};

export const generateToken = (data: any) => {
    // jti
    const jti = v4();
    // Add jti to data
    data.jti = jti;
    return jwt.sign({ _id: data._id, name: data.name, role: data.role, email: data.email }, SECRET_KEY, jwtOptions);
};