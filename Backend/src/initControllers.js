import authRouter from "./Routes/AuthRouter.js";
import userRouter from "./Routes/UsersRouter.js"

export const initControllers=(app)=>{

app.use("/users",userRouter);








app.use("/api/auth",authRouter);
}   