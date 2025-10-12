import {Router} from 'express';
import authController from "../Controllers/AuthController.js";
import { fileUpload } from '../Utils/UploadFile.js';


const authRouter=Router();


authRouter.post("/signup",authController.signUp);
authRouter.get("/verify-email",authController.verifyEmail);



export default authRouter;




