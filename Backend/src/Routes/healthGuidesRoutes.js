import express from "express";
import { HealthGuidesController } from "../Controllers/HealthGuidesController.js";
import multer from "multer";
import { fileUpload } from "../Utils/UploadFile.js";


const router = express.Router();
const upload = fileUpload();
router.get("/getGuides", HealthGuidesController.getGuides);
router.post( "/createGuide", upload.array("files"), HealthGuidesController.createGuide);
router.put("/updateGuide/:id",upload.array("files"), HealthGuidesController.updateGuide);
router.delete("/deleteGuide/:id",HealthGuidesController.deleteGuide);
router.get("/searchGuides",HealthGuidesController.searchGuides);

export default router;