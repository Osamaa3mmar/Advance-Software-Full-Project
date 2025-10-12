import { AuthRepository } from "../Repositories/AuthRepository.js"
import bcrypt from "bcryptjs";
export class AuthService{
    
    static signup=async (user)=>{
        try{
            //هون بتاكد انو باعت الداتا 
            if(!user.email){
                return {success:false,message:"Email is required"};
            }else if(!user.password){
                return {success:false,message:"Password is required"};
            }else if(!user.role || ["PATIENT","DOCTOR","DONOR"].includes(user.role)===false){
                return {success:false,message:"Role is required"};
            }


            //هون بتاكد انو الايميل مش مستخدم
            let isUsedEmail=await AuthRepository.isUsedEmail(user.email);
            if(isUsedEmail>0){
                return {success:false,message:"Email is already in use"};
            }
            //هون بعمل هاش للباسورد
            let hashedPassword= bcrypt.hashSync(user.password,8);
            user.password=hashedPassword;

            //هون بعمل يوزر جديد
            let result=await AuthRepository.createUser(user);
            //TODO: send verification email and url
            if(result.affectedRows>0){
                //هون بعمل يوزر جديد في الجدول المناسب حسب الرول
                if(user.role==="PATIENT"){
                    await AuthRepository.createPatient(result.insertId);
                }else if(user.role==="DOCTOR"){
                    await AuthRepository.createDoctor(result.insertId);

                }else if(user.role==="DONOR"){
                    await AuthRepository.createDonor(result.insertId);
                }
                return {success:true,message:"User created successfully"};
            }else{
                return {success:false,message:"User creation failed"};
            }
        }catch(error){
            return {success:false,message:"Server error",error};
        }
    }
}