import { AuthService } from "../Services/AuthService.js";
import cloudinary from "../Utils/Cloudinary.js";

class AuthController{

    signUp=async(req,res)=>{
        try{
            let response=await AuthService.signup(req.body);
            if(response.success===true){
                res.status(201).json({message:response.message})
            }
            else{
                res.status(400).json({message:response.message});
            }
        }catch(error){
            console.log(error)
            res.status(500).json({message:"Server Error",error});
        }
    }
    verifyEmail=async(req,res)=>{
        try{
            let response=await AuthService.verifyEmail(req.query);
            if(response.success===true){
                res.status(200).json({message:response.message})
            }
            else{
                res.status(400).json({message:response.message});
            }
        }catch(error){
            res.status(500).json({message:"Server Error",error});
        }
    }
   

}


const authController=new AuthController();
export default authController;