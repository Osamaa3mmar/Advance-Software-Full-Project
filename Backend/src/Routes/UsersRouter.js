import { Router } from "express";
import usersController from "../Controllers/UsersController.js";
import { isLogin } from "../Middleware/IsLogin.js";
import { isAdmin } from "../Middleware/IsAdmin.js";
import { fileUpload } from "../Utils/UploadFile.js";
import axios from "axios";

const userRouter = Router();
const upload = fileUpload();

userRouter.get("/getAll", usersController.getAllUsers);
userRouter.get("/profile", isLogin, usersController.getUserById);

// Public/Admin routes
userRouter.get("/all", isLogin, isAdmin, usersController.getAllUsers);
userRouter.get("/user/:id", isLogin, usersController.getUserById);

// Current user profile routes (authenticated users)
userRouter.get("/profile", isLogin, usersController.getCurrentProfile);
userRouter.put("/profile", isLogin, usersController.updateProfile);
userRouter.put(
  "/profile/image",
  isLogin,
  upload.single("profile_image"),
  usersController.updateProfileImage
);
userRouter.put(
  "/profile/role-specific",
  isLogin,
  usersController.updateRoleSpecificProfile
);

// Delete profile
userRouter.delete("/profile/:id", isLogin, usersController.deleteProfile);

// Admin-only routes
userRouter.put(
  "/verify-patient/:id",
  isLogin,
  isLogin,
  usersController.verifyPatient
);

userRouter.post("/test", async (req, res) => {
  try {
    const { text, target } = req.body || {};

    // Validate inputs early to avoid sending bad requests to the remote API
    if (!text || !target) {
      return res
        .status(400)
        .json({ message: "Both 'text' and 'target' fields are required" });
    }

    const payload = {
      q: text,
      source: "auto",
      target: target,
      format: "text",
    };

    const response = await axios.post(
      "https://libretranslate.com/translate",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 10000,
      }
    );

    // LibreTranslate response shape may vary; guard for common fields
    const translatedText =
      response.data?.translatedText ||
      response.data?.translated_text ||
      response.data?.translated ||
      response.data;
    return res.json({ translatedText });
  } catch (error) {
    // Log full error for debugging and return a useful message to client
    console.error(
      "LibreTranslate error:",
      error.response ? error.response.data : error.message
    );
    const status = error.response?.status || 500;
    const body = error.response?.data || { message: error.message };
    return res.status(status).json({ error: body });
  }
});

export default userRouter;
