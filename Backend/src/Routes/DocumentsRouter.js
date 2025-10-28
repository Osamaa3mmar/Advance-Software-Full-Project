import { Router } from "express";
import { isLogin } from "../Middleware/IsLogin.js";
import { isAdmin } from "../Middleware/IsAdmin.js";
import documentsController from "../Controllers/DocumentsController.js";
import { fileUpload } from "../Utils/UploadFile.js";

const documentsRouter = Router();

documentsRouter.get(
  "/recentPending",
  isLogin,
  isAdmin,
  documentsController.getRecentPendingDocuments
);
documentsRouter.post(
  "/upload",
  isLogin,
  fileUpload().fields([{ name: "document", maxCount: 1 }]),
  documentsController.uploadDocument
);

documentsRouter.get("/all",isLogin,isAdmin,documentsController.getAllFiles);
documentsRouter.put("/status/:docId",isLogin,isAdmin,documentsController.changeDocStatus)
export default documentsRouter;
