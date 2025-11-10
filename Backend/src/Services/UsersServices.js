import { UsersRepository } from "../Repositories/UsersRepository.js"
import cloudinary from "../Utils/Cloudinary.js";

export class UsersServices {

    static getAllUsers = async () => {
        try {
            const users = await UsersRepository.getAllUsers();
            return { success: true, users };
        } catch (error) {
            return { success: false, message: "Failed to retrieve users", error };
        }
    }

    static getUserById = async (userId) => {
        try {
            const user = await UsersRepository.getUserById(userId);
            if (!user) {
                return { success: false, message: "User not found" };
            }
            console.log("hereeeeee")
            return { success: true, user };
        } catch (error) {
            return { success: false, message: "Failed to retrieve user", error };
        }
    }

    static getCurrentUserProfile = async (userId) => {
        try {
            const profile = await UsersRepository.getCompleteProfile(userId);
            if (!profile) {
                return { success: false, message: "User profile not found" };
            }
            return { success: true, profile };
        } catch (error) {
            return { success: false, message: "Failed to retrieve profile", error };
        }
    }

    static updateProfile = async (userId, userData) => {
        try {
            // Validate data
            if (userData.email) {
                return { success: false, message: "Email cannot be changed" };
            }

            if (userData.phone_number && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/.test(userData.phone_number)) {
                return { success: false, message: "Invalid phone number format" };
            }

            if (userData.birth_date) {
                const birthDate = new Date(userData.birth_date);
                const today = new Date();
                if (birthDate > today) {
                    return { success: false, message: "Birth date cannot be in the future" };
                }
            }

            const result = await UsersRepository.updateUserProfile(userId, userData);
            if (!result || result.affectedRows === 0) {
                return { success: false, message: "No changes made or user not found" };
            }

            const updatedProfile = await UsersRepository.getCompleteProfile(userId);
            return { success: true, message: "Profile updated successfully", profile: updatedProfile };
        } catch (error) {
            return { success: false, message: "Failed to update profile", error };
        }
    }

    static updateProfileImage = async (userId, file) => {
        try {
            if (!file) {
                return { success: false, message: "No file provided" };
            }

            // Upload to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(file.path, {
                folder: "healthpal/profiles",
                transformation: [
                    { width: 500, height: 500, crop: "fill" },
                    { quality: "auto" }
                ]
            });

            // Update user profile with new image URL
            const result = await UsersRepository.updateUserProfile(userId, {
                profile_image_url: uploadResult.secure_url
            });

            if (!result || result.affectedRows === 0) {
                return { success: false, message: "Failed to update profile image" };
            }

            return {
                success: true,
                message: "Profile image updated successfully",
                imageUrl: uploadResult.secure_url
            };
        } catch (error) {
            return { success: false, message: "Failed to upload profile image", error };
        }
    }

    static updateRoleSpecificProfile = async (userId, role, roleData) => {
        try {
            let result;

            if (role === "PATIENT") {
                if (roleData.medical_info && roleData.medical_info.length > 1000) {
                    return { success: false, message: "Medical info is too long (max 1000 characters)" };
                }
                result = await UsersRepository.updatePatientProfile(userId, roleData);
            } else if (role === "DOCTOR") {
                if (!roleData.specialization) {
                    return { success: false, message: "Specialization is required" };
                }
                result = await UsersRepository.updateDoctorProfile(userId, roleData);
            } else if (role === "DONOR") {
                result = await UsersRepository.updateDonorProfile(userId, roleData);
            } else {
                return { success: false, message: "Invalid role" };
            }

            if (!result || result.affectedRows === 0) {
                return { success: false, message: "No changes made or profile not found" };
            }

            const updatedProfile = await UsersRepository.getCompleteProfile(userId);
            return { success: true, message: "Role-specific profile updated successfully", profile: updatedProfile };
        } catch (error) {
            return { success: false, message: "Failed to update role-specific profile", error };
        }
    }

    static deleteProfile = async (userId, requestingUserId, requestingUserRole) => {
        try {
            // Users can only delete their own profile (or admins can delete any profile)
            if (userId !== requestingUserId && requestingUserRole !== "ADMIN") {
                return { success: false, message: "Unauthorized to delete this profile" };
            }

            const result = await UsersRepository.deleteUser(userId);
            if (!result || result.affectedRows === 0) {
                return { success: false, message: "User not found or already deleted" };
            }

            return { success: true, message: "Profile deleted successfully" };
        } catch (error) {
            return { success: false, message: "Failed to delete profile", error };
        }
    }

    static verifyPatient = async (patientId, adminRole) => {
        try {
            // Only admins can verify patients
            if (adminRole !== "ADMIN") {
                return { success: false, message: "Only admins can verify patients" };
            }

            const result = await UsersRepository.verifyPatient(patientId);
            if (!result || result.affectedRows === 0) {
                return { success: false, message: "Patient not found" };
            }

            return { success: true, message: "Patient verified successfully" };
        } catch (error) {
            return { success: false, message: "Failed to verify patient", error };
        }
    }
}