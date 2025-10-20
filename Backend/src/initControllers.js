

import healthGuidesRoutes from "./Routes/healthGuidesRoutes.js";
import authRouter from "./Routes/AuthRouter.js";
import alertRoutes from "./Routes/alertRouter.js";
import groupRoutes from "./Routes/groupRouter.js"
import groupMessagesRouter from "./Routes/groupMessagesRouter.js"
export const initControllers=(app)=>{


app.use("/api/healthGuides", healthGuidesRoutes);
app.use("/api/auth",authRouter);
app.use("/api/alerts", alertRoutes);
app.use("/api/supportGroups",groupRoutes)
app.use("/api/group/messages",groupMessagesRouter)

}
