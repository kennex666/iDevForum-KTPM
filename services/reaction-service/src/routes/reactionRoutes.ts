import express from "express";
import * as reactionController from "../controllers/reactionControllers";

const router = express.Router();

router.get("/", reactionController.getAllReactions);
router.post("/createReaction", reactionController.createReaction);
router.delete("/deleteReaction", reactionController.deleteReaction);
router.get("/getReactionsByTargetId/:id", reactionController.getReactionsByTargetId);
router.put("/updateReaction", reactionController.updateReaction);
router.get("/getReaction/:id", reactionController.getReactionById);

export default router;