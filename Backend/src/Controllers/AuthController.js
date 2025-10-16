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

 



  

  
 

  
}

const authController = new AuthController();
export default authController;
