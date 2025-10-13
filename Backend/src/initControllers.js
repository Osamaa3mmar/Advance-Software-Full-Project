import userRouter from "./Routes/UsersRouter.js"
import healthGuidesRoutes from "./Routes/healthGuidesRoutes.js";
import workshopsRouter from "./Routes/workshopsRouter.js";
import authRouter from "./Routes/AuthRouter.js";
import alertRoutes from "./Routes/alertRouter.js";
import groupRoutes from "./Routes/groupRouter.js";
import groupMessagesRouter from "./Routes/groupMessagesRouter.js";
import orgRouter from "./Routes/OrganizationRouter.js";
import medicalNeedsRouter from "./Routes/medicalNeedsRouter.js";

import AdminInfoRouter from "./Routes/AdminInfoRouter.js";
import userRouter from "./Routes/UsersRouter.js";
import documentsRouter from "./Routes/DocumentsRouter.js";
import roomsRouter from "./Routes/RoomsRouter.js";


export const initControllers = (app) => {
  app.use("/healthGuides", healthGuidesRoutes);
  app.use("/api/auth", authRouter);
  app.use("/workshops", workshopsRouter);
  app.use("/api/organization", orgRouter);
  app.use("/api/alerts", alertRoutes);
app.use("/api/supportGroups",groupRoutes)
app.use("/api/group/messages",groupMessagesRouter);
app.use("/api/admin",AdminInfoRouter);
app.use("/api/users",userRouter);
app.use("/api/documents",documentsRouter);
	app.use("/api/medicalNeeds", medicalNeedsRouter);
  app.use("/api/anonymous-messages", anonymousMessagesRouter);
}
// app.use("/api/rooms",roomsRouter);

