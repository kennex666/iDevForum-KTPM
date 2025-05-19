import express from "express";

import * as UserController from "../controllers/UserController";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

router.post("/register", UserController.registerUser);

router.get("/profile/:id", UserController.getUserByIdHandler);

router.get("/getall", UserController.getAllUsersHandler);

// name, email, username, role, accountState
router.get("/search", UserController.searchUsersHandler);

router.post("/search-email", UserController.getUserByEmailHandler);

router.put("/profile/:id", UserController.updateUserHandler);

router.delete("/profile/:id", UserController.deleteUserHandler);

router.put("/updatepassword/:id", UserController.updatePasswordHandler);

router.post("/createUserByAdmin",authenticate ,UserController.createUserByAdminHandler);



export default router;
