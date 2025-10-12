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
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                margin: 0;
                padding: 0;
                background-color: #f5f7fa;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            }
            .email-wrapper {
                background-color: #f5f7fa;
                padding: 40px 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
            }
            .header {
                background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
                padding: 40px 20px;
                text-align: center;
            }
            .logo {
                color: #ffffff;
                font-size: 32px;
                font-weight: 700;
                letter-spacing: -0.5px;
                margin: 0;
            }
            .logo-subtitle {
                color: rgba(255, 255, 255, 0.9);
                font-size: 14px;
                margin-top: 8px;
            }
            .content {
                padding: 40px 30px;
            }
            .greeting {
                font-size: 24px;
                font-weight: 600;
                color: #1a202c;
                margin: 0 0 16px 0;
            }
            .text {
                font-size: 16px;
                line-height: 1.6;
                color: #4a5568;
                margin: 0 0 24px 0;
            }
            .button-container {
                text-align: center;
                margin: 32px 0;
            }
            .verify-button {
                display: inline-block;
                padding: 16px 40px;
                background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
                color: #fff !important;
                text-decoration: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .verify-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(33, 150, 243, 0.4);
            }
            .divider {
                height: 1px;
                background: linear-gradient(to right, transparent, #e2e8f0, transparent);
                margin: 32px 0;
            }
            .help-text {
                font-size: 14px;
                color: #718096;
                line-height: 1.5;
                margin: 0;
            }
            .link-fallback {
                background-color: #f7fafc;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                padding: 16px;
                margin-top: 24px;
                word-break: break-all;
            }
            .link-fallback-text {
                font-size: 13px;
                color: #718096;
                margin: 0 0 8px 0;
            }
            .link-fallback-url {
                font-size: 13px;
                color: #2196F3;
                margin: 0;
            }
            .footer {
                background-color: #f7fafc;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e2e8f0;
            }
            .footer-text {
                font-size: 13px;
                color: #718096;
                margin: 0 0 8px 0;
            }
            .footer-links {
                margin-top: 16px;
            }
            .footer-link {
                color: #2196F3;
                text-decoration: none;
                font-size: 13px;
                margin: 0 12px;
            }
            .copyright {
                font-size: 12px;
                color: #a0aec0;
                margin-top: 16px;
            }
        </style>
    </head>
    <body>
        <div class="email-wrapper">
            <div class="container">
                <div class="header">
                    <h1 class="logo">HealthPal</h1>
                    <p class="logo-subtitle">Your Personal Health Companion</p>
                </div>
                
                <div class="content">
                    <h2 class="greeting">Welcome aboard! 🎉</h2>
                    
                    <p class="text">
                        We're thrilled to have you join the HealthPal community. You're just one step away from accessing personalized health insights and tools designed to help you live your healthiest life.
                    </p>
                    
                    <p class="text">
                        To get started, please verify your email address by clicking the button below:
                    </p>
                    
                    <div class="button-container">
                        <a href="${verificationLink}" class="verify-button">Verify My Email</a>
                    </div>
                    
                    <div class="link-fallback">
                        <p class="link-fallback-text">If the button doesn't work, copy and paste this link into your browser:</p>
                        <p class="link-fallback-url">${verificationLink}</p>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <p class="help-text">
                        If you didn't create a HealthPal account, you can safely ignore this email. No account will be created without verification.
                    </p>
                </div>
                
                <div class="footer">
                    
                    <p class="copyright">© 2025 HealthPal. All rights reserved.</p>
                </div>
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
    static verifyEmail=async (query)=>{
        if(!query.code){
            return {success:false,message:" Verification code is required"};
        }
        let code=await VerificationCodesRepository.findValidCode(query.code,"VERIFY_EMAIL");
        if(!code){
            return {success:false,message:"Invalid or expired verification code or already used"};
        }
        // If code is valid, mark it as used
        await VerificationCodesRepository.markCodeAsUsed(code.id);
        await AuthRepository.markEmailAsVerified(code.target_id);
        return {success:true,message:"Email verified successfully"};
    }
}