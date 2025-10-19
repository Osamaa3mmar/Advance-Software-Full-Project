import healthGuidesRoutes from "./Routes/healthGuidesRoutes.js";
import workshopsRouter from "./Routes/workshopsRouter.js";
import authRouter from "./Routes/AuthRouter.js";
import orgRouter from "./Routes/OrganizationRouter.js";

export const initControllers = (app) => {
  app.use("/healthGuides", healthGuidesRoutes);
  app.use("/api/auth", authRouter);
  app.use("/workshops", workshopsRouter);
  app.use("/api/organization", orgRouter);//
};
