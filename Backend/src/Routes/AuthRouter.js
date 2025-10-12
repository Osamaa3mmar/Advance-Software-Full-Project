import {Router} from 'express';
import authController from "../Controllers/AuthController.js";
import { fileUpload } from '../Utils/UploadFile.js';
import { isLogin } from '../Middleware/IsLogin.js';
import { isDoctor } from '../Middleware/IsDoctor.js';
import { isPatient } from '../Middleware/IsPatient.js';


const authRouter=Router();


authRouter.post("/signup",authController.signUp);
authRouter.get("/verify-email",authController.verifyEmail);
authRouter.post("/login",authController.login);
    

export default authRouter;




