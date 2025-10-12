
import userRouter from "./Routes/UsersRouter.js"
import healthGuidesRoutes from "./Routes/healthGuidesRoutes.js";
import authRouter from "./Routes/AuthRouter.js";
export const initControllers=(app)=>{


app.use("/healthGuides", healthGuidesRoutes);
app.use("/api/auth",authRouter);


}
