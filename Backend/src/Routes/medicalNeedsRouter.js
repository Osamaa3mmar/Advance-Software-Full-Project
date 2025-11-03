import express from "express";
import MedicalNeedsController from "../Controllers/MedicalNeedsControllers.js";
import { isLogin } from "../Middleware/IsLogin.js";
import { isOrganization } from "../Middleware/isOrganization.js";

const router = express.Router();

// Get all medical needs (any logged in user)
router.get("/", isLogin, MedicalNeedsController.getMedicalNeeds);

// Get specific medical need (any logged in user)
router.get("/:id", isLogin, MedicalNeedsController.getMedicalNeedById);

// Create medical need (organizations only)
router.post(
	"/",
	isLogin,
	isOrganization,
	MedicalNeedsController.createMedicalNeed
);

export default router;
