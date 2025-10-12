import { AuthRepository } from "../Repositories/AuthRepository.js"
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';

import EmailSender from "../Utils/EmailSender.js";
import { VerificationCodesRepository } from "../Repositories/verificationCodesRepository.js";
export const getWelcomeEmailTemplate = (verificationLink) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container {
                max-width: 500px;
                margin: 0 auto;
                font-family: Arial, sans-serif;
                padding: 20px;
            }
            .logo {
                text-align: center;
                margin-bottom: 30px;
                color: #2196F3;
                font-size: 24px;
            }
            .content {
                line-height: 1.6;
                color: #444;
            }
            .verify-button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #2196F3;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin: 20px 0;
            }
            .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #666;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">
                HealthPal
            </div>
            <div class="content">
                <p>Welcome to HealthPal!</p>
                <p>Please verify your email address to complete your registration.</p>
                <a href="${verificationLink}" class="verify-button">Verify Email</a>
                <p>If you didn't create this account, please ignore this email.</p>
            </div>
            <div class="footer">
                © 2025 HealthPal
            </div>
        </div>
    </body>
    </html>
  `;
};
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
            let code=uuidv4(20);
            await VerificationCodesRepository.createVerificationCode(result.insertId,code,"VERIFY_EMAIL");
            EmailSender.sendEmail(user.email,"Welcome to HealthPal",getWelcomeEmailTemplate("http://localhost:5555/api/auth/verify-email?code="+code));
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