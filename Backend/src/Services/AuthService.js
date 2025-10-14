import { AuthRepository } from "../Repositories/AuthRepository.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

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
export const getResetPasswordTemplate = (code) => {
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
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 8px;
                padding: 40px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 24px;
                color: #2196F3;
                font-weight: bold;
            }
            .code-container {
                background-color: #f8f9fa;
                border-radius: 6px;
                padding: 20px;
                text-align: center;
                margin: 20px 0;
            }
            .code {
                font-size: 32px;
                font-weight: bold;
                color: #1976D2;
                letter-spacing: 4px;
            }
            .text {
                color: #4a5568;
                line-height: 1.6;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                color: #718096;
                font-size: 14px;
                margin-top: 30px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">HealthPal</div>
            </div>
            
            <p class="text">Hello,</p>
            
            <p class="text">We received a request to reset your password. Here is your password reset code:</p>
            
            <div class="code-container">
                <div class="code">${code}</div>
            </div>
            
            <p class="text">This code will expire in 15 minutes. If you didn't request a password reset, please ignore this email.</p>
            
            <div class="footer">
                <p>© 2025 HealthPal. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};
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

      //هون بتاكد انو الايميل مش مستخدم
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

      // Hash the new password
      const hashedPassword = bcrypt.hashSync(newPassword, 8);

      // Update password
      await AuthRepository.updatePassword(user.id, hashedPassword);

      // Mark code as used
      await VerificationCodesRepository.markCodeAsUsed(verificationCode.id);

      return {
        success: true,
        message: "Password has been reset successfully",
      };
    } catch (error) {
      return { success: false, message: "Server error", error };
    }
  };

  static createOrganization = async (name, email, type) => {
    try {
      if (!name || !email || !type) {
        return {
          success: false,
          message: "Organization name, email, and type are required",
        };
      }

      // Check if email is already used
      let isUsedEmail = await AuthRepository.isOrganizationEmailUsed(email);
      if (isUsedEmail > 0) {
        return { success: false, message: "Email is already in use" };
      }

      // Create organization without password
      const result = await AuthRepository.createOrganization({
        name,
        email,
        type,
        is_active: false, // Will be activated after password setup
      });

      // Generate 8-digit code for first-time setup
      const code = Math.floor(10000000 + Math.random() * 90000000).toString();

      // Save verification code
      await VerificationCodesRepository.createVerificationCode(
        result.insertId,
        code,
        "ORGANIZATION_REGISTER"
      );

      // Send email with verification code
      await EmailSender.sendEmail(
        email,
        "Organization Registration",
        getResetPasswordTemplate(code) // We can reuse the reset password template
      );

      return {
        success: true,
        message: "Organization created successfully. Setup code sent to email.",
      };
    } catch (error) {
      return { success: false, message: "Server error", error };
    }
  };

  static setupOrganizationPassword = async (email, code, password) => {
    try {
      if (!email || !code || !password) {
        return {
          success: false,
          message: "Email, code and password are required",
        };
      }

      const organization = await AuthRepository.getOrganizationByEmail(email);
      if (!organization) {
        return { success: false, message: "Organization not found" };
      }

      // Verify the code
      const verificationCode = await VerificationCodesRepository.findValidCode(
        code,
        "ORGANIZATION_REGISTER"
      );

      if (!verificationCode || verificationCode.target_id !== organization.id) {
        return { success: false, message: "Invalid or expired setup code" };
      }

      // Hash the password
      const hashedPassword = bcrypt.hashSync(password, 8);

      // Update organization with password and activate it
      await AuthRepository.activateOrganization(
        organization.id,
        hashedPassword
      );

      // Mark code as used
      await VerificationCodesRepository.markCodeAsUsed(verificationCode.id);

      return {
        success: true,
        message: "Organization setup completed successfully",
      };
    } catch (error) {
      return { success: false, message: "Server error", error };
    }
  };

  static loginOrganization = async (credentials) => {
    try {
      if (!credentials.email || !credentials.password) {
        return { success: false, message: "Email and password are required" };
      }

      const organization = await AuthRepository.getOrganizationByEmail(
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
        organization: {
          id: organization.id,
          name: organization.name,
          email: organization.email,
          type: organization.type,
          phone_number: organization.phone_number,
          profile_image_url: organization.profile_image_url,
          street: organization.street,
          city: organization.city,
        },
      };
    } catch (error) {
      console.error("Organization login error:", error);
      return { success: false, message: "Server error", error };
    }
  };

  static updateOrganizationProfile = async (
    orgId,
    updateData,
    profileImage
  ) => {
    try {
      // Get current organization data
      const currentOrg = await AuthRepository.getOrganizationById(orgId);
      if (!currentOrg) {
        return { success: false, message: "Organization not found" };
      }

      const updateFields = {};

      // Validate and process all possible fields
      if (updateData.name) {
        if (updateData.name.length < 3 || updateData.name.length > 255) {
          return {
            success: false,
            message: "Name must be between 3 and 255 characters",
          };
        }
        updateFields.name = updateData.name;
      }

      if (updateData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updateData.email)) {
          return { success: false, message: "Invalid email format" };
        }

        // Check if email is already used by another organization
        const isUsed = await AuthRepository.isOrganizationEmailUsed(
          updateData.email
        );
        if (isUsed > 0 && currentOrg.email !== updateData.email) {
          return { success: false, message: "Email is already in use" };
        }
        updateFields.email = updateData.email;
      }

      if (updateData.type) {
        const validTypes = [
          "HOSPITAL",
          "PHARMACY",
          "CLINIC",
          "LABORATORY",
          "CHARITY",
          "BLOOD_BANK",
          "OTHER",
        ];
        if (!validTypes.includes(updateData.type)) {
          return { success: false, message: "Invalid organization type" };
        }
        updateFields.type = updateData.type;
      }

      if (updateData.phone_number) {
        const phoneRegex = /^\+?[\d\s-]{8,}$/;
        if (!phoneRegex.test(updateData.phone_number)) {
          return { success: false, message: "Invalid phone number format" };
        }
        updateFields.phone_number = updateData.phone_number;
      }

      if (updateData.street) {
        if (updateData.street.length > 255) {
          return { success: false, message: "Street address is too long" };
        }
        updateFields.street = updateData.street;
      }

      if (updateData.city) {
        if (updateData.city.length > 100) {
          return { success: false, message: "City name is too long" };
        }
        updateFields.city = updateData.city;
      }

      // Handle profile image upload if provided
      if (profileImage) {
        try {
          // Delete old profile image from Cloudinary if exists
          if (currentOrg.profile_image_url) {
            const publicId = currentOrg.profile_image_url
              .split("/")
              .pop()
              .split(".")[0];
            await cloudinary.uploader.destroy(publicId);
          }

          // Upload new image
          const result = await cloudinary.uploader.upload(profileImage.path, {
            folder: "organization_profiles",
          });
          updateFields.profile_image_url = result.secure_url;
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          return { success: false, message: "Failed to upload profile image" };
        }
      }

      if (Object.keys(updateFields).length === 0) {
        return { success: false, message: "No valid fields to update" };
      }

      // Update organization
      await AuthRepository.updateOrganization(orgId, updateFields);

      // Get updated organization data
      const updatedOrg = await AuthRepository.getOrganizationById(orgId);

      return {
        success: true,
        message: "Organization profile updated successfully",
        organization: {
          id: updatedOrg.id,
          name: updatedOrg.name,
          email: updatedOrg.email,
          type: updatedOrg.type,
          phone_number: updatedOrg.phone_number,
          profile_image_url: updatedOrg.profile_image_url,
          street: updatedOrg.street,
          city: updatedOrg.city,
          is_active: updatedOrg.is_active,
        },
      };
    } catch (error) {
      console.error("Update organization error:", error);
      return { success: false, message: "Server error", error };
    }
  };

  static requestOrganizationPasswordReset = async (email) => {
    try {
      if (!email) {
        return { success: false, message: "Email is required" };
      }

      const organization = await AuthRepository.getOrganizationByEmail(email);
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

      // Save code in verification_codes table
      await VerificationCodesRepository.createVerificationCode(
        organization.id,
        code,
        "ORGANIZATION_RESET_PASSWORD"
      );

      // Send email with code
      await EmailSender.sendEmail(
        email,
        "Organization Password Reset Request",
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

  static resetOrganizationPassword = async (email, code, newPassword) => {
    try {
      if (!email || !code || !newPassword) {
        return {
          success: false,
          message: "Email, code and new password are required",
        };
      }

      const organization = await AuthRepository.getOrganizationByEmail(email);
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
        "ORGANIZATION_RESET_PASSWORD"
      );

      if (!verificationCode || verificationCode.target_id !== organization.id) {
        return { success: false, message: "Invalid or expired reset code" };
      }

      // Hash the new password
      const hashedPassword = bcrypt.hashSync(newPassword, 8);

      // Update password
      await AuthRepository.updateOrganizationPassword(
        organization.id,
        hashedPassword
      );

      // Mark code as used
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
