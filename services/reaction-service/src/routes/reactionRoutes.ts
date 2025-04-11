import express from "express";
import * as reactionController from "../controllers/reactionControllers";

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "Hello from Reaction Service" });
}
);
router.post("/createReaction", reactionController.createReaction);
router.delete("/deleteReaction", reactionController.deleteReaction);
router.get("/getReactionsByTargetId/:id", reactionController.getReactionsByTargetId);
router.put("/updateReaction", reactionController.updateReaction);

export default router;