import { AuthService } from "../Services/AuthService.js";


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
        let response=await AuthService.login(req.body);
        if(response.success){
          return res.status(200).json({message:response.message,token:response.token});
        }
        else{
          return res.status(400).json({message:response.message});
        }
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  };
}

const authController = new AuthController();
export default authController;
