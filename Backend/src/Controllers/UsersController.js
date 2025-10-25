import { UsersServices } from "../Services/UsersServices.js"

class UsersController {



    getAllUsers=async(req,res)=>{
        const users=await UsersServices.getAllUsers(req.body?.name);
        res.json({message:"Success",users});
    }
    getUserById=async(req,res)=>{
        const user=await UsersServices.getUserById(req.user.id);
        res.json({message:"Success",user});
    }
}



const usersController=new UsersController();
export default usersController;