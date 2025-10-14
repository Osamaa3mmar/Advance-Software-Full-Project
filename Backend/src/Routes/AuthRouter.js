import { Router } from "express";
import authController from "../Controllers/AuthController.js";
import { fileUpload } from "../Utils/UploadFile.js";
import { isLogin } from "../Middleware/IsLogin.js";
import { isDoctor } from "../Middleware/IsDoctor.js";
import { isPatient } from "../Middleware/IsPatient.js";
import { adminMiddleware } from "../Middleware/adminMiddleware.js";
import { isOrganization } from "../Middleware/isOrganization.js";

const authRouter = Router();

authRouter.post("/signup", authController.signUp);
authRouter.get("/verify-email", authController.verifyEmail);
authRouter.post("/login", authController.login);
authRouter.post("/request-reset-password", authController.requestResetPassword);
authRouter.post("/reset-password", authController.resetPassword);

// Organization routes
authRouter.post(
  "/create-organization",
  isLogin,
  adminMiddleware,
  authController.createOrganization
);
authRouter.post(
  "/organization-setup",
  authController.setupOrganizationPassword
);
authRouter.post("/login-organization", authController.loginOrganization);

// Organization profile and password management
authRouter.put(
  "/organization-profile",
  isLogin,
  isOrganization,
  fileUpload().fields([{ name: "profile_image", maxCount: 1 }]),
  authController.updateOrganizationProfile
);
authRouter.post(
  "/organization-request-reset",
  authController.requestOrganizationPasswordReset
);
authRouter.post(
  "/organization-reset-password",
  authController.resetOrganizationPassword
);

export default authRouter;
