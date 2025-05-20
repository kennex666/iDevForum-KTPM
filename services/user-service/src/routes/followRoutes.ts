import express from "express";
import { authenticate } from "../middlewares/authenticate";
import { followUser } from "../controllers/FollowController";

const followRoutes = express.Router();

followRoutes.get("/follow/:id", authenticate, followUser);

export default followRoutes;
