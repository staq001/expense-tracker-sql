import { Router } from "express";

import { auth } from "../middleware/auth";
import { UserController } from "../controllers/user";

const userController = new UserController();
const userRouter = Router();

userRouter.post("/user/signup", userController.signUp);

userRouter.post("/user/login", userController.loginUser);

userRouter.get("/user/me", auth, userController.getUser);

userRouter.patch("/user/me/update", auth, userController.updateUser);

userRouter.delete("/user/me/delete", auth, userController.deleteUser);

export default userRouter;
