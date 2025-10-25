import { Router } from "express";
import { isLogin } from "../Middleware/IsLogin.js";
import { isAdmin } from "../Middleware/IsAdmin.js";
import adminInfoController from "../Controllers/AdminControllers.js";

const AdminInfoRouter=Router();



AdminInfoRouter.get("/info",isLogin,isAdmin,adminInfoController.getSummerize);
AdminInfoRouter.get("/organizations/all",isLogin,isAdmin,adminInfoController.getAllOrganizations);
AdminInfoRouter.delete("/organization/delete/:id",isLogin,isAdmin,adminInfoController.deleteOrganization);

export default AdminInfoRouter;