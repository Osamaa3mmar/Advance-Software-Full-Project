import { Router } from 'express';
import  alertControllers  from '../Controllers/AlertControllers.js';
import { isLogin } from '../Middleware/IsLogin.js';
import { isAdmin } from '../Middleware/IsAdmin.js';

const alertRouter = Router();
alertRouter.get("/getAlerts", isLogin,alertControllers.getAlerts);
alertRouter.post("/createAlert", isLogin,isAdmin, alertControllers.createAlert);
alertRouter.put("/updateAlert/:id", isLogin,isAdmin, alertControllers.updateAlert);
alertRouter.delete("/deleteAlert/:id", isLogin,isAdmin, alertControllers.deleteAlert);

export default alertRouter;
