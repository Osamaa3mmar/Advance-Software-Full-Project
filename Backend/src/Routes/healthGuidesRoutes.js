import express from "express";

import { HealthGuidesController } from "../Controllers/HealthGuidesController.js";
import {  isAdmin } from "../Middleware/IsAdmin.js";
import  healthGuidesController from "../Controllers/HealthGuidesController.js";
import { fileUpload } from "../Utils/UploadFile.js";
import { isLogin } from "../Middleware/IsLogin.js";
const router = express.Router();

const upload = fileUpload();
router.get("/getGuides", isLogin, healthGuidesController.getGuides);
router.post( "/createGuide", isLogin, isAdmin, upload.array("files"), healthGuidesController.createGuide);
router.put("/updateGuide/:id", isLogin, isAdmin, upload.array("files"), healthGuidesController.updateGuide);
router.delete("/deleteGuide/:id", isLogin, isAdmin, healthGuidesController.deleteGuide);
router.get("/searchGuides", isLogin, healthGuidesController.searchGuides);

export default router;

