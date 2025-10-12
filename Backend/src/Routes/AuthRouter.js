import {Router} from 'express';
import authController from "../Controllers/AuthController.js";


const authRouter=Router();


authRouter.post("/signup",authController.signUp);




export default authRouter;




