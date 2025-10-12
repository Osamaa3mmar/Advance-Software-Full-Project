import authRouter from "./Routes/AuthRouter.js";

export const initControllers=(app)=>{


app.use("/api/auth",authRouter);
}   