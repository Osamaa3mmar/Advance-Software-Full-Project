import express from "express";
import WorkshopsController from "../Controllers/WorkshopsController.js";
import { isLogin } from "../Middleware/IsLogin.js";
import { adminMiddleware } from "../Middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", WorkshopsController.getWorkshops);
router.get("/:id", WorkshopsController.getWorkshopById);
// new clearer admin endpoint
router.post(
	"/create",
	isLogin,
	adminMiddleware,
	WorkshopsController.createWorkshop
);
// existing legacy endpoints (kept for compatibility)
router.post("/", isLogin, adminMiddleware, WorkshopsController.createWorkshop);
router.put("/:id", isLogin, adminMiddleware, WorkshopsController.editWorkshops);
router.delete(
	"/:id",
	isLogin,
	adminMiddleware,
	WorkshopsController.deleteWorkshop
);

export default router;
