import express from "express";

import * as UserController from "../controllers/UserController";

const router = express.Router();

router.post("/register", UserController.registerUser);

router.get("/:id", UserController.getUserByIdHandler);

router.get("/getall", UserController.getAllUsersHandler);

// name, email, username, role, accountState
router.get("/search", UserController.searchUsersHandler);

router.get("/email/:email", UserController.getUserByEmailHandler);

router.put("/:id", UserController.updateUserHandler);

router.delete("/:id", UserController.deleteUserHandler);

router.put("/updatepassword/:id", UserController.updatePasswordHandler);



export default router;
