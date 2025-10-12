import userRouter from "./Routes/UsersRouter.js"

export const initControllers=(app)=>{

app.use("/users",userRouter);
}   