
import healthGuidesRoutes from "./Routes/healthGuidesRoutes.js";
import authRouter from "./Routes/AuthRouter.js";
import orgRouter from "./Routes/OrganizationRouter.js";
export const initControllers=(app)=>{


app.use("/healthGuides", healthGuidesRoutes);
app.use("/api/auth",authRouter);
app.use("/api/organization",orgRouter);

}
