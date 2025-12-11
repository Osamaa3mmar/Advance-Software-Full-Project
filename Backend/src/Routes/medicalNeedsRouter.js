import express from "express";
import MedicalNeedsController from "../Controllers/MedicalNeedsControllers.js";
import { isLogin } from "../Middleware/IsLogin.js";
import { isOrganization } from "../Middleware/isOrganization.js";

const router = express.Router();

// Get all medical needs (any logged in user)
router.get("/", isLogin, MedicalNeedsController.getMedicalNeeds);

// Get specific medical need (any logged in user)
router.get("/:id", isLogin, MedicalNeedsController.getMedicalNeedById);

// Create medical need (verified patients and organizations)
router.post("/", isLogin, MedicalNeedsController.createMedicalNeed);

// Update medical need status (patients and organizations only)
router.put(
  "/:id/status",
  isLogin,
  MedicalNeedsController.updateMedicalNeedStatus
);

// Update medical need (patients and organizations only)
router.put("/:id", isLogin, MedicalNeedsController.updateMedicalNeed);

// Delete medical need (patients and organizations only)
router.delete("/:id", isLogin, MedicalNeedsController.deleteMedicalNeed);

export default router;
