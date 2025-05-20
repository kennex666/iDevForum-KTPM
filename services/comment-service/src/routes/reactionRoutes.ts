import express, { Router } from 'express';
import { reactionController } from '../controllers/reactionController';
import { authenticate } from '../utils/authenticate';

const router: Router = express.Router();

router.get("/", 
    (req: any, res: any) => {
        // test
        res.json({
            errorCode: 200,
            errorMessage: "Pong",
            data: null,
        });
    }
);
router.get('/getAllViaPost/:id', reactionController.getAllReactionsViaPost);
router.get('/getAllViaUser/:id', reactionController.getAllReactionsViaUser);
router.get("/action/:action/:postId", authenticate, reactionController.reactionAction);

export default router;