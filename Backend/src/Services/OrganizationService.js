import { OrganizationRepository } from "../Repositories/OrganizationRepository.js";
import { VerificationCodesRepository } from "../Repositories/verificationCodesRepository.js";
import EmailSender from "../Utils/EmailSender.js";
import { getResetPasswordTemplate } from "../HtmlTemplates/ResetPassword.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export class OrganizationService {

 static createOrganization = async (name, email, type) => {
    // try {
      if (!name || !email || !type) {
        return {
          success: false,
          message: "Organization name, email, and type are required",
        };
      }

      let isUsedEmail = await OrganizationRepository.isOrganizationEmailUsed(email);
      if (isUsedEmail > 0) {
        return { success: false, message: "Email is already in use" };
      }

      const result = await OrganizationRepository.createOrganization({
        name,
        email,
        type,
        is_active: false, 
      });
      const code = Math.floor(10000000 + Math.random() * 90000000).toString();

      await VerificationCodesRepository.createVerificationCode(
        result.insertId,
        code,
        "ORGANIZATION_REGISTER"
      );
      await EmailSender.sendEmail(
        email,
        "Organization Registration",
        getResetPasswordTemplate(code)
      );

      return {
        success: true,
        message: "Organization created successfully. Setup code sent to email.",
      };
    // } catch (error) {
    //   return { success: false, message: "Server error", error };
    // }
  };

  static setupOrganizationPassword = async (email, code, password) => {
    // try {
      if (!email || !code || !password) {
        return {
          success: false,
          message: "Email, code and password are required",
        };
      }

      const organization = await OrganizationRepository.getOrganizationByEmail(email);
      if (!organization) {
        return { success: false, message: "Organization not found" };
      }

      const verificationCode = await VerificationCodesRepository.findValidCode(
        code,
        "ORGANIZATION_REGISTER"
      );

      if (!verificationCode || verificationCode.target_id !== organization.id) {
        return { success: false, message: "Invalid or expired setup code" };
      }

      const hashedPassword = bcrypt.hashSync(password, 8);

      await OrganizationRepository.activateOrganization(
        organization.id,
        hashedPassword
      );

      // Mark code as used
      await VerificationCodesRepository.markCodeAsUsed(verificationCode.id);

      return {
        success: true,
        message: "Organization setup completed successfully",
      };
    // } catch (error) {
    //   return { success: false, message: "Server error", error };
    // }
  };

  static loginOrganization = async (credentials) => {
    // try {
    console.log(credentials);
      if (!credentials.email || !credentials.password) {
        return { success: false, message: "Email and password are required" };
      }

      const organization = await OrganizationRepository.getOrganizationByEmail(
        credentials.email
      );
      if (!organization) {
        return { success: false, message: "Organization not found" };
      }

      if (!organization.is_active) {
        return {
          success: false,
          message: "Organization account is not activated",
        };
      }
      console.log(organization);
      const isCorrect = bcrypt.compareSync(
        credentials.password,
        organization.password
      );
      if (!isCorrect) {
        return { success: false, message: "Invalid password" };
      }

      const tokenInfo = {
        id: organization.id,
        role: "ORGANIZATION",
        type: organization.type,
        email: organization.email,
        name: organization.name,
      };

      const token = jwt.sign(tokenInfo, "healthpal");
      return {
        success: true,
        message: "Login successful",
        token,
      };
    // } catch (error) {
    //   console.error("Organization login error:", error);
    //   return { success: false, message: "Server error", error };
    // }
  };




    static requestOrganizationPasswordReset = async (email) => {
    // try {
      if (!email) {
        return { success: false, message: "Email is required" };
      }

      const organization = await OrganizationRepository.getOrganizationByEmail(email);
      if (!organization) {
        return { success: false, message: "Organization not found" };
      }

      if (!organization.is_active) {
        return {
          success: false,
          message: "Organization account is not activated",
        };
      }

      // Generate 8-digit code
      const code = Math.floor(10000000 + Math.random() * 90000000).toString();

      await VerificationCodesRepository.createVerificationCode(
        organization.id,
        code,
        "RESET_PASSWORD"
      );
      await EmailSender.sendEmail(
        email,
        "Organization Password Reset Request",
        getResetPasswordTemplate(code)
      );

      return {
        success: true,
        message: "Password reset code has been sent to your email",
      };
    // } catch (error) {
    //   return { success: false, message: "Server error", error };
    // }
  };

  static resetOrganizationPassword = async (email, code, newPassword) => {
    try {
      if (!email || !code || !newPassword) {
        return {
          success: false,
          message: "Email, code and new password are required",
        };
      }

      const organization = await OrganizationRepository.getOrganizationByEmail(email);
      if (!organization) {
        return { success: false, message: "Organization not found" };
      }

      if (!organization.is_active) {
        return {
          success: false,
          message: "Organization account is not activated",
        };
      }

      // Verify the code
      const verificationCode = await VerificationCodesRepository.findValidCode(
        code,
        "RESET_PASSWORD"
      );

      if (!verificationCode || verificationCode.target_id !== organization.id) {
        return { success: false, message: "Invalid or expired reset code" };
      }

      const hashedPassword = bcrypt.hashSync(newPassword, 8);

      await OrganizationRepository.updateOrganizationPassword(
        organization.id,
        hashedPassword
      );

      await VerificationCodesRepository.markCodeAsUsed(verificationCode.id);

      return {
        success: true,
        message: "Organization password has been reset successfully",
      };
    } catch (error) {
      return { success: false, message: "Server error", error };
    }
  };
}