import express from "express";
import  groupControllers  from "../Controllers/GroupController.js";
import { isLogin } from '../Middleware/IsLogin.js';
import { isAdmin } from '../Middleware/IsAdmin.js';

const router = express.Router();

router.post("/createGroup",isLogin,isAdmin, groupControllers.createGroup);
router.get("/getgroups",isLogin, groupControllers.getGroups);
router.post("/groups/:id/join",isLogin, groupControllers.sendJoinRequest);
router.get("/groups/:id/requests",isLogin,isAdmin, groupControllers.getRequests);
router.patch("/requests/:id",isLogin,isAdmin, groupControllers.updateRequest);
router.patch("/group/update/:id",isLogin,isAdmin, groupControllers.updateGroupInfo);
router.get("/groups",isLogin, groupControllers.getUserGroups);

export default router;
