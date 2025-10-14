import { AuthService } from "../Services/AuthService.js";
import cloudinary from "../Utils/Cloudinary.js";

class AuthController {
  signUp = async (req, res) => {
    try {
      let response = await AuthService.signup(req.body);
      if (response.success === true) {
        return res.status(201).json({ message: response.message });
      } else {
        return res.status(400).json({ message: response.message });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error", error });
    }
  };
  verifyEmail = async (req, res) => {
    try {
      let response = await AuthService.verifyEmail(req.query);
      if (response.success === true) {
        return res.status(200).json({ message: response.message });
      } else {
        return res.status(400).json({ message: response.message });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  };
  test = async (req, res) => {
    console.log(req.user);
    res.status(200).json({ message: "Test Route" });
  };

  login = async (req, res) => {
    try {
      let response = await AuthService.login(req.body);
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

  requestResetPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const response = await AuthService.requestResetPassword(email);
      if (response.success) {
        return res.status(200).json({ message: response.message });
      } else {
        return res.status(400).json({ message: response.message });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  };

  resetPassword = async (req, res) => {
    try {
      const { email, code, newPassword } = req.body;
      const response = await AuthService.resetPassword(
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

  createOrganization = async (req, res) => {
    try {
      const { name, email, type } = req.body;
      const response = await AuthService.createOrganization(name, email, type);
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
    try {
      const { email, code, password } = req.body;
      const response = await AuthService.setupOrganizationPassword(
        email,
        code,
        password
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

  loginOrganization = async (req, res) => {
    try {
      const response = await AuthService.loginOrganization(req.body);
      if (response.success) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json({ message: response.message });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  };

  updateOrganizationProfile = async (req, res) => {
    try {
      const organizationId = req.user.id;
      // Get the profile image from the files object if it exists
      const profileImage = req.files?.profile_image?.[0];
      const response = await AuthService.updateOrganizationProfile(
        organizationId,
        req.body,
        profileImage
      );
      if (response.success) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json({ message: response.message });
      }
    } catch (error) {
      console.error("Controller error:", error);
      return res.status(500).json({ message: "Server Error", error });
    }
  };

  requestOrganizationPasswordReset = async (req, res) => {
    try {
      const { email } = req.body;
      const response = await AuthService.requestOrganizationPasswordReset(
        email
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

  resetOrganizationPassword = async (req, res) => {
    try {
      const { email, code, newPassword } = req.body;
      const response = await AuthService.resetOrganizationPassword(
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
}

const authController = new AuthController();
export default authController;
