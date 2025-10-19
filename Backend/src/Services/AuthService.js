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

  
  // static updateOrganizationProfile = async (
  //   orgId,
  //   updateData,
  //   profileImage
  // ) => {
  //   try {
  //     const currentOrg = await AuthRepository.getOrganizationById(orgId);
  //     if (!currentOrg) {
  //       return { success: false, message: "Organization not found" };
  //     }

  //     const updateFields = {};

  //     if (updateData.name) {
  //       if (updateData.name.length < 3 || updateData.name.length > 255) {
  //         return {
  //           success: false,
  //           message: "Name must be between 3 and 255 characters",
  //         };
  //       }
  //       updateFields.name = updateData.name;
  //     }

  //     if (updateData.email) {
  //       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //       if (!emailRegex.test(updateData.email)) {
  //         return { success: false, message: "Invalid email format" };
  //       }

  //       // Check if email is already used by another organization
  //       const isUsed = await AuthRepository.isOrganizationEmailUsed(
  //         updateData.email
  //       );
  //       if (isUsed > 0 && currentOrg.email !== updateData.email) {
  //         return { success: false, message: "Email is already in use" };
  //       }
  //       updateFields.email = updateData.email;
  //     }

  //     if (updateData.type) {
  //       const validTypes = [
  //         "HOSPITAL",
  //         "PHARMACY",
  //         "CLINIC",
  //         "LABORATORY",
  //         "CHARITY",
  //         "BLOOD_BANK",
  //         "OTHER",
  //       ];
  //       if (!validTypes.includes(updateData.type)) {
  //         return { success: false, message: "Invalid organization type" };
  //       }
  //       updateFields.type = updateData.type;
  //     }

  //     if (updateData.phone_number) {
  //       const phoneRegex = /^\+?[\d\s-]{8,}$/;
  //       if (!phoneRegex.test(updateData.phone_number)) {
  //         return { success: false, message: "Invalid phone number format" };
  //       }
  //       updateFields.phone_number = updateData.phone_number;
  //     }

  //     if (updateData.street) {
  //       if (updateData.street.length > 255) {
  //         return { success: false, message: "Street address is too long" };
  //       }
  //       updateFields.street = updateData.street;
  //     }

  //     if (updateData.city) {
  //       if (updateData.city.length > 100) {
  //         return { success: false, message: "City name is too long" };
  //       }
  //       updateFields.city = updateData.city;
  //     }

  //     // Handle profile image upload if provided
  //     if (profileImage) {
  //       try {
  //         // Delete old profile image from Cloudinary if exists
  //         if (currentOrg.profile_image_url) {
  //           const publicId = currentOrg.profile_image_url
  //             .split("/")
  //             .pop()
  //             .split(".")[0];
  //           await cloudinary.uploader.destroy(publicId);
  //         }

  //         // Upload new image
  //         const result = await cloudinary.uploader.upload(profileImage.path, {
  //           folder: "organization_profiles",
  //         });
  //         updateFields.profile_image_url = result.secure_url;
  //       } catch (uploadError) {
  //         console.error("Image upload error:", uploadError);
  //         return { success: false, message: "Failed to upload profile image" };
  //       }
  //     }

  //     if (Object.keys(updateFields).length === 0) {
  //       return { success: false, message: "No valid fields to update" };
  //     }

  //     // Update organization
  //     await AuthRepository.updateOrganization(orgId, updateFields);

  //     // Get updated organization data
  //     const updatedOrg = await AuthRepository.getOrganizationById(orgId);

  //     return {
  //       success: true,
  //       message: "Organization profile updated successfully",
  //       organization: {
  //         id: updatedOrg.id,
  //         name: updatedOrg.name,
  //         email: updatedOrg.email,
  //         type: updatedOrg.type,
  //         phone_number: updatedOrg.phone_number,
  //         profile_image_url: updatedOrg.profile_image_url,
  //         street: updatedOrg.street,
  //         city: updatedOrg.city,
  //         is_active: updatedOrg.is_active,
  //       },
  //     };
  //   } catch (error) {
  //     console.error("Update organization error:", error);
  //     return { success: false, message: "Server error", error };
  //   }
  // };


}
