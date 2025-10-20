import express from "express";
import  groupMessagesController  from "../Controllers/GroupMessagesController.js";
import { isLogin } from '../Middleware/IsLogin.js';
import { fileUpload } from "../Utils/UploadFile.js";
import { isAdmin } from '../Middleware/IsAdmin.js';

const router = express.Router();
const upload = fileUpload();
router.post("/sendmessage",isLogin, upload.single("file"),groupMessagesController.sendMessage);
router.get("/:groupId",isLogin,groupMessagesController.getAllMessages);
export default router;
 