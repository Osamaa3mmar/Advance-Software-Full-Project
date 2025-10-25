import { OrganizationService } from "../Services/OrganizationService.js";

class OrganizationController {
  createOrganization = async (req, res) => {
    try {
      const { name, email, type } = req.body;
      const response = await OrganizationService.createOrganization(
        name,
        email,
        type, req.files.org_image
      );
      if (response.success) {
        return res.status(201).json({ message: response.message });
      } else {
        return res.status(400).json({ message: response.message });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  };
  setupOrganizationPassword = async (req, res) => {
    // try {
    const { email, code, password } = req.body;
    const response = await OrganizationService.setupOrganizationPassword(
      email,
      code,
      password
    );
    if (response.success) {
      return res.status(200).json({ message: response.message,token:response.token });
    } else {
      return res.status(400).json({ message: response.message });
    }
    // } catch (error) {
    //   return res.status(500).json({ message: "Server Error", error });
    // }
  };
  loginOrganization = async (req, res) => {
    try {
    const response = await OrganizationService.loginOrganization(req.body);
    if (response.success) {
      return res
        .status(200)
        .json({ message: response.message, token: response.token });
    } else {
      return res.status(400).json({ message: response.message });
    }
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  };

 
  requestOrganizationPasswordReset = async (req, res) => {
    try {
    console.log(req.body);
      if(!req.body.email){
        return res.status(400).json({ message: "Email is required" });
      }
      const { email } = req.body;
      const response =
        await OrganizationService.requestOrganizationPasswordReset(email);
      if (response.success) {
        return res.status(200).json({ message: response.message });
      } else {
        return res.status(400).json({ message: response.message });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  };

  resetOrganizationPassword = async (req, res) => {
    try {
      if(!req.body.email || !req.body.code || !req.body.newPassword){
        return res.status(400).json({ message: "Email, code and new password are required" });
      }
      const { email, code, newPassword } = req.body;
      const response = await OrganizationService.resetOrganizationPassword(
        email,
        code,
        newPassword
      );
      if (response.success) {
        return res.status(200).json({ message: response.message });
      } else {
        return res.status(400).json({ message: response.message });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  };
  getAllOrganizations = async (req, res) => {
    try {
      const organizations = await OrganizationService.getAllOrganizations();
      return res.status(200).json({ message: "Success", organizations });
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }

  };
}
const organizationController = new OrganizationController();
export default organizationController;
