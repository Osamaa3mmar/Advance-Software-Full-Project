import express from "express";
import { HealthGuidesController } from "../Controllers/HealthGuidesController.js";
import {  isAdmin } from "../Middleware/IsAdmin.js";

const router = express.Router();

router.get("/", HealthGuidesController.getGuides);
router.post("/", isAdmin, HealthGuidesController.createGuide);

export default router;
