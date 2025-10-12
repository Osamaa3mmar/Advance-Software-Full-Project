import { Router } from "express";
import usersController from "../Controllers/UsersController.js";
const userRouter=Router();


userRouter.get("/getAll",usersController.getAllUsers);


export default userRouter;