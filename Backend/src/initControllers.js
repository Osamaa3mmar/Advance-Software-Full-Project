
import userRouter from "./Routes/UsersRouter.js"
import healthGuidesRoutes from "./Routes/healthGuidesRoutes.js";
import authRouter from "./Routes/AuthRouter.js";
import alertRoutes from "./Routes/alertRouter.js";
export const initControllers=(app)=>{


app.use("/api/healthGuides", healthGuidesRoutes);
app.use("/api/auth",authRouter);
app.use("/api/alerts", alertRoutes);

}
