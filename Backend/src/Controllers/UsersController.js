import { UsersServices } from "../Services/UsersServices.js"

class UsersController {



    getAllUsers=async(req,res)=>{
        const users=await UsersServices.getAllUsers(req.body?.name);
        res.json({message:"Success",users});
    }
}



const usersController=new UsersController();
export default usersController;