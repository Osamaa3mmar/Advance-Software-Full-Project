import { Router } from "express";
import DonationController from "../Controllers/DonationControllers.js";
import { isLogin } from "../Middleware/IsLogin.js";
import { isDonnor } from "../Middleware/IsDonner.js";

const donationRouter = Router();

// Create donation (donors only)
donationRouter.post("/", isLogin, isDonnor, DonationController.createDonation);

// Get all donations
donationRouter.get("/", isLogin, DonationController.getAllDonations);

// Get donation by ID
donationRouter.get("/:id", isLogin, DonationController.getDonationById);

// Get donations for a specific medical need
donationRouter.get(
	"/need/:needId",
	isLogin,
	DonationController.getDonationsByNeed
);

export default donationRouter;
