import {Router} from 'express';
import authController from "../Controllers/AuthController.js";



const authRouter=Router();


authRouter.post("/signup",authController.signUp);
authRouter.get("/verify-email",authController.verifyEmail);
authRouter.post("/login",authController.login);
    

export default authRouter;




