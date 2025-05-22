import express from 'express';
import { authenticate } from '../utils/authenticate';
import {sendMail} from '../controllers/mailController';
import { askGPT } from '../controllers/aiController';

const thirdPartyRoute = express.Router();

thirdPartyRoute.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Third Party Service API',
        version: '1.0.0',
    });
});

// // /email
// thirdPartyRoute.post('/email', authenticate, sendMail);
// // /ai
// thirdPartyRoute.get('/ai', authenticate, askGPT);

export default thirdPartyRoute;
