import express from "express";

import * as UserController from "../controllers/UserController";

const router = express.Router();

router.post("/register", UserController.registerUser);

router.get("/profile", UserController.getUserByIdHandler);

router.get("/getall", UserController.getAllUsersHandler);

// name, email, username, role, accountState
router.get("/search", UserController.searchUsersHandler);

router.post("/search-email", UserController.getUserByEmailHandler);

router.put("/profile", UserController.updateUserHandler);

router.delete("/profile", UserController.deleteUserHandler);

router.put("/updatepassword/:id", UserController.updatePasswordHandler);



export default router;
