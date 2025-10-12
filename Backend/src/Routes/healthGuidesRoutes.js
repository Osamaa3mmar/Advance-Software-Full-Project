import express from "express";
import { HealthGuidesController } from "../Controllers/HealthGuidesController.js";
import { adminMiddleware } from "../Middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", HealthGuidesController.getGuides);
router.post("/", adminMiddleware, HealthGuidesController.createGuide);


export default router;