import userRouter from "./Routes/UsersRouter.js";
import healthGuidesRoutes from "./Routes/healthGuidesRoutes.js";
import workshopsRouter from "./Routes/workshopsRouter.js";
import authRouter from "./Routes/AuthRouter.js";
export const initControllers = (app) => {
	app.use("/healthGuides", healthGuidesRoutes);
	app.use("/api/auth", authRouter);
	app.use("/workshops", workshopsRouter);
};
