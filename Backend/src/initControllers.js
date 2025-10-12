import userRouter from "./Routes/UsersRouter.js"
import healthGuidesRoutes from "./Routes/healthGuidesRoutes.js";
export const initControllers=(app)=>{

app.use("/users",userRouter);
app.use("/healthGuides", healthGuidesRoutes);
}   