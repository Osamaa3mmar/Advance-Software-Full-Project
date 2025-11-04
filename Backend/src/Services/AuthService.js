import { AuthRepository } from "../Repositories/AuthRepository.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { getResetPasswordTemplate } from "../HtmlTemplates/ResetPassword.js";
import { getWelcomeEmailTemplate } from "../HtmlTemplates/Wellcome.js";
import EmailSender from "../Utils/EmailSender.js";
import { VerificationCodesRepository } from "../Repositories/verificationCodesRepository.js";


export class AuthService {
  static signup = async (user) => {
    try {
      //هون بتاكد انو باعت الداتا
      if (!user.email) {
        return { success: false, message: "Email is required" };
      } else if (!user.password) {
        return { success: false, message: "Password is required" };
      } else if (
        !user.role ||
        ["PATIENT", "DOCTOR", "DONOR"].includes(user.role) === false
      ) {
        return { success: false, message: "Role is required" };
      }

      let isUsedEmail = await AuthRepository.isUsedEmail(user.email);
      if (isUsedEmail > 0) {
        return { success: false, message: "Email is already in use" };
      }
      //هون بعمل هاش للباسورد
      let hashedPassword = bcrypt.hashSync(user.password, 8);
      user.password = hashedPassword;

      //هون بعمل يوزر جديد
      let result = await AuthRepository.createUser(user);
      let code = uuidv4(20);
      await VerificationCodesRepository.createVerificationCode(
        result.insertId,
        code,
        "VERIFY_EMAIL"
      );
      EmailSender.sendEmail(
        user.email,
        "Welcome to HealthPal",
        getWelcomeEmailTemplate(
          "http://localhost:5555/api/auth/verify-email?code=" + code
        )
      );
      if (result.affectedRows > 0) {
        //هون بعمل يوزر جديد في الجدول المناسب حسب الرول
        if (user.role === "PATIENT") {
          await AuthRepository.createPatient(result.insertId);
        } else if (user.role === "DOCTOR") {
          await AuthRepository.createDoctor(result.insertId);
        } else if (user.role === "DONOR") {
          await AuthRepository.createDonor(result.insertId);
        }
        return { success: true, message: "User created successfully" };
      } else {
        return { success: false, message: "User creation failed" };
      }
    } catch (error) {
      return { success: false, message: "Server error", error };
    }
  };
  static verifyEmail = async (query) => {
    try {
      if (!query.code) {
        return { success: false, message: " Verification code is required" };
      }
      let code = await VerificationCodesRepository.findValidCode(
        query.code,
        "VERIFY_EMAIL"
      );
      if (!code) {
        return {
          success: false,
          message: "Invalid or expired verification code or already used",
        };
      }
      // If code is valid, mark it as used
      await VerificationCodesRepository.markCodeAsUsed(code.id);
      await AuthRepository.markEmailAsVerified(code.target_id);
      return { success: true, message: "Email verified successfully" };
    } catch (error) {
      return { success: false, message: "Server error", error };
    }
  };
  static login = async (credentials) => {
    try {
      if (!credentials) {
        return { success: false, message: "Email & Password are required" };
      }
      if (!credentials.email) {
        return { success: false, message: "Email is required" };
      }
      if (!credentials.password) {
        return { success: false, message: "Password is required" };
      }
      let user = await AuthRepository.getUserByEmail(credentials.email);
      if (!user) {
        return {
          success: false,
          message: `There is no user with :${credentials.email} in the system .`,
        };
      } else if (!user.email_verified) {
        return {
          success: false,
          message: `The ${credentials.email} email is not verify .`,
        };
      }
      let isCorrect = bcrypt.compareSync(credentials.password, user.password);
      if (isCorrect) {
        let tokeInfo = {
          first_name:user.first_name,
          id: user.id,
          role: user.role,
          email: user.email,
        };
        let token = jwt.sign(tokeInfo, "healthpal");
        return { success: true, message: "Login Success", token };
      } else {
        return { success: false, message: "Wrong Password" };
      }
    } catch (error) {
      return { success: false, message: "Server error", error };
    }
  };

  static requestResetPassword = async (email) => {
    try {
      if (!email) {
        return { success: false, message: "Email is required" };
      }

      const user = await AuthRepository.getUserByEmail(email);
      if (!user) {
        return { success: false, message: "No user found with this email" };
      }

      // Generate 8-digit code
      const code = Math.floor(10000000 + Math.random() * 90000000).toString();

      // Save code in verification_codes table
      await VerificationCodesRepository.createVerificationCode(
        user.id,
        code,
        "RESET_PASSWORD"
      );

      // Send email with code
      await EmailSender.sendEmail(
        email,
        "Password Reset Request",
        getResetPasswordTemplate(code)
      );

      return {
        success: true,
        message: "Password reset code has been sent to your email",
      };
    } catch (error) {
      return { success: false, message: "Server error", error };
    }
  };

  static resetPassword = async (email, code, newPassword) => {
    try {
      if (!email || !code || !newPassword) {
        return {
          success: false,
          message: "Email, code and new password are required",
        };
      }

      const user = await AuthRepository.getUserByEmail(email);
      if (!user) {
        return { success: false, message: "No user found with this email" };
      }

      // Verify the code
      const verificationCode = await VerificationCodesRepository.findValidCode(
        code,
        "RESET_PASSWORD"
      );

      if (!verificationCode || verificationCode.target_id !== user.id) {
        return { success: false, message: "Invalid or expired reset code" };
      }

      const hashedPassword = bcrypt.hashSync(newPassword, 8);

      await AuthRepository.updatePassword(user.id, hashedPassword);

      await VerificationCodesRepository.markCodeAsUsed(verificationCode.id);

      return {
        success: true,
        message: "Password has been reset successfully",
      };
    } catch (error) {
      return { success: false, message: "Server error", error };
    }
  };


}
