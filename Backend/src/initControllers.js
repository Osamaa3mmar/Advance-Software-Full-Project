import userRouter from "./Routes/UsersRouter.js"
import healthGuidesRoutes from "./Routes/healthGuidesRoutes.js";
import authRouter from "./Routes/AuthRouter.js";
import filesRouter from "./Routes/FilesRouter.js";
import anonymousMessagesRouter from "./Routes/AnonymousMessagesRouter.js";

export const initControllers = (app) => {

    app.use("/api/auth", authRouter);
    app.use("/api/users", userRouter);
    app.use("/api/healthGuides", healthGuidesRoutes);
    app.use("/api/files", filesRouter);
    app.use("/api/anonymous-messages", anonymousMessagesRouter);

}
