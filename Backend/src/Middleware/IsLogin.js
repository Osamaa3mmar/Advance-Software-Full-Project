import jwt from "jsonwebtoken"


export const isLogin=(req,res,next)=>{
    try{
        const token=req.headers.authorization;
        const decode=jwt.decode(token,"healthpal");
        if(!decode){
            res.status(401).json({message:"Unauthorized User"});
            return;
        }
        const decoded = jwt.verify(token, "healthpal"); 

    req.user = decoded;
        next();
    }catch(error){
        res.status(500).json({message:"Invalid Token",error});
    }
}