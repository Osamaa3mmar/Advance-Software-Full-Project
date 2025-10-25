import AdminInfoServices from "../Services/AdminInfoServices.js";


class AdminInfoController{
    getSummerize= async (req,res)=>{
        try{
            const response=await AdminInfoServices.getSummary();
            if(response.success){
                return res.status(200).json({message:response.message,data:response.data});
            }
            else{
                return res.status(400).json({message:response.message});
            }
        }catch(error){
            return res.status(500).json({message:"Serve Error",error});
        }
    }
    getAllOrganizations=async(req,res)=>{
        try{
            const organizations=await AdminInfoServices.getAllOrganizations();
            return res.status(200).json({message:"Success",organizations});
        }catch(error){
            return res.status(500).json({message:"Server Error",error});
        }}
}


const adminInfoController=new AdminInfoController();
export default adminInfoController;