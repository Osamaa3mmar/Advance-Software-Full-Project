// routes/mediaRoutes.js
import express from "express";
import { upload } from "../middlewares/uploadMiddleware.js";
import { uploadMedia } from "../Controllers/mediaController.js";

const router = express.Router();

// رفع صورة أو فيديو
router.post("/upload", upload.single("file"), uploadMedia);

export default router;
