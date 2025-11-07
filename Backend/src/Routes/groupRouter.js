import express from "express";
import  groupControllers  from "../Controllers/GroupController.js";
import { isLogin } from '../Middleware/IsLogin.js';
import { isAdmin } from '../Middleware/IsAdmin.js';

const router = express.Router();

router.post("/groups", isLogin, isAdmin, groupControllers.createGroup);          // create group
router.get("/groups", isLogin, groupControllers.getGroups);                    // get all groups
router.get("/groups/user", isLogin, groupControllers.getUserGroups);        // get groups of the logged user
router.post("/groups/:id/join", isLogin, groupControllers.sendJoinRequest);            // join group request
router.get("/groups/:id/requests", isLogin, isAdmin, groupControllers.getRequests);  // get join requests
router.patch("/requests/:id", isLogin, isAdmin, groupControllers.updateRequest);     // approve/deny request
router.patch("/groups/update/:id", isLogin, isAdmin, groupControllers.updateGroupInfo);     // update group info
router.delete("/groups/:id", isLogin, isAdmin, groupControllers.deleteGroup);        // delete group


export default router;
