import express from "express";
import WorkshopsController from "../Controllers/WorkshopsController.js";
import { isLogin } from "../Middleware/IsLogin.js";
import { isAdmin } from "../Middleware/IsAdmin.js";

const router = express.Router();

router.get("/", WorkshopsController.getWorkshops);
router.get("/:id", WorkshopsController.getWorkshopById);
// new clearer admin endpoint
router.post("/create", isLogin, isAdmin, WorkshopsController.createWorkshop);
// existing legacy endpoints (kept for compatibility)
router.post("/", isLogin, isAdmin, WorkshopsController.createWorkshop);
router.put("/:id", isLogin, isAdmin, WorkshopsController.editWorkshops);
router.delete("/:id", isLogin, isAdmin, WorkshopsController.deleteWorkshop);

export default router;
