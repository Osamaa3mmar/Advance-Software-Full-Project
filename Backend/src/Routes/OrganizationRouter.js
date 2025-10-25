import { Router } from "express";
import organizationController from "../Controllers/OrganizationController.js";
import { isAdmin } from "../Middleware/IsAdmin.js";
import { isLogin } from "../Middleware/IsLogin.js";
import { fileUpload } from "../Utils/UploadFile.js";
const orgRouter = Router();
orgRouter.post(
  "/create-organization",
  isLogin,
  isAdmin,fileUpload().fields([{name:"org_image",maxCount:1}]),
  organizationController.createOrganization
);
orgRouter.put(
  "/organization-setup",
  organizationController.setupOrganizationPassword
);
orgRouter.post("/login", organizationController.loginOrganization);

orgRouter.get(
  "/all-organizations",
  organizationController.getAllOrganizations
);
// orgRouter.put(
//   "/organization-profile",
//   isLogin,
//   isOrganization,
//   fileUpload().fields([{ name: "profile_image", maxCount: 1 }]),
//   organizationController.updateOrganizationProfile
// );
orgRouter.post(
  "/request-reset-password",
  organizationController.requestOrganizationPasswordReset
);
orgRouter.put(
  "/reset-password",
  organizationController.resetOrganizationPassword
);

export default orgRouter;
