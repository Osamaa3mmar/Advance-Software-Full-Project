import { Router } from "express";
import usersController from "../Controllers/UsersController.js";
import { isLogin } from "../Middleware/IsLogin.js";
import { isAdmin } from "../Middleware/IsAdmin.js";
import { fileUpload } from "../Utils/UploadFile.js";

const userRouter = Router();
const upload=fileUpload()

userRouter.get("/getAll",usersController.getAllUsers);
userRouter.get("/profile",isLogin,usersController.getUserById);

// Public/Admin routes
userRouter.get("/all", isLogin, isAdmin, usersController.getAllUsers);
userRouter.get("/user/:id", isLogin, usersController.getUserById);

// Current user profile routes (authenticated users)
userRouter.get("/profile", isLogin, usersController.getCurrentProfile);
userRouter.put("/profile", isLogin, usersController.updateProfile);
userRouter.put("/profile/image", isLogin, upload.single("profile_image"), usersController.updateProfileImage);
userRouter.put("/profile/role-specific", isLogin, usersController.updateRoleSpecificProfile);

// Delete profile
userRouter.delete("/profile/:id", isLogin, usersController.deleteProfile);

// Admin-only routes
userRouter.put("/verify-patient/:id", isLogin, isLogin, usersController.verifyPatient);

export default userRouter;