import jwt from 'jsonwebtoken';
const SECRET_KEY = "your-secret-key"; // Replace with your actual secret key


export const jwtMiddleware = (req: any, res: any, next: any) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(200).json({ 
            errorCode: '401',
            errorMessage: 'No token provided',
        })
    }
    
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
		if (err) {
			return res.status(200).json({
				errorCode: "401",
				errorMessage: "Failed to authenticate token",
			});
		}
		req.user = decoded;
		next();
	});
}
