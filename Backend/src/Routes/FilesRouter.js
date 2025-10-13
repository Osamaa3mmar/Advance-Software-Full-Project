import { Router } from "express";
import filesController from "../Controllers/FilesController.js";
import { isLogin } from "../Middleware/IsLogin.js";
import { isPatient } from "../Middleware/IsPatient.js";
import { isDoctor } from "../Middleware/IsDoctor.js";
import multer from "multer";

// Configure multer for file uploads (supports all file types)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "/tmp");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.originalname.replace(/\s/g, '_') + "-" + uniqueSuffix);
    }
});

const fileUploadAny = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const filesRouter = Router();

// Patient file routes
filesRouter.post("/patient/upload", isLogin, isPatient, fileUploadAny.single("file"), filesController.uploadPatientFile);
filesRouter.get("/patient/:patientId", isLogin, filesController.getPatientFiles);

// Doctor file routes
filesRouter.post("/doctor/upload", isLogin, isDoctor, fileUploadAny.single("file"), filesController.uploadDoctorFile);
filesRouter.get("/doctor/:doctorId", isLogin, filesController.getDoctorFiles);

// General file routes
filesRouter.get("/my-files", isLogin, filesController.getMyFiles);
filesRouter.delete("/:fileId", isLogin, filesController.deleteFile);

export default filesRouter;
