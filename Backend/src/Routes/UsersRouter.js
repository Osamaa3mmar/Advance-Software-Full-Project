import { Router } from "express";
import usersController from "../Controllers/UsersController.js";
import { isLogin } from "../Middleware/IsLogin.js";
const userRouter=Router();


userRouter.get("/getAll",usersController.getAllUsers);
userRouter.get("/profile",isLogin,usersController.getUserById);


export default userRouter;