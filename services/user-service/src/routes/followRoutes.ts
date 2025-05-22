import express from "express";
import { authenticate } from "../middlewares/authenticate";
import { followUser, getAuthorProfileFollower } from "../controllers/FollowController";

const followRoutes = express.Router();

followRoutes.get("/follow/:id", authenticate, followUser);
followRoutes.get("/follower", getAuthorProfileFollower);

export default followRoutes;
