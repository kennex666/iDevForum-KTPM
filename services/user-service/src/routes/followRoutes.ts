import express from "express";
import { authenticate } from "../middlewares/authenticate";
import { followUser, getAuthorProfileFollower, getFollowingUserIds } from "../controllers/FollowController";

const followRoutes = express.Router();

followRoutes.get("/follow/:id", authenticate, followUser);
followRoutes.get("/follower", getAuthorProfileFollower);
followRoutes.get("/follower-details", authenticate, getFollowingUserIds);

export default followRoutes;
