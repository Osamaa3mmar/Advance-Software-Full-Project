import { UsersServices } from "../Services/UsersServices.js"

class UsersController {

    // Get all users (admin only)
    getAllUsers = async (req, res) => {
        try {
            const response = await UsersServices.getAllUsers();
            if (response.success) {
                return res.status(200).json({ message: "Users retrieved successfully", users: response.users });
            } else {
                return res.status(400).json({ message: response.message });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server Error", error });
        }
    }

    // Get user by ID
    getUserById = async (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            const response = await UsersServices.getUserById(userId);
            if (response.success) {
                return res.status(200).json({ message: "User retrieved successfully", user: response.user });
            } else {
                return res.status(404).json({ message: response.message });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server Error", error });
        }
    }

    // Get current user's profile (authenticated user)
    getCurrentProfile = async (req, res) => {
        try {
            const userId = req.user.id;
            const response = await UsersServices.getCurrentUserProfile(userId);
            if (response.success) {
                return res.status(200).json({ message: "Profile retrieved successfully", profile: response.profile });
            } else {
                return res.status(404).json({ message: response.message });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server Error", error });
        }
    }

    // Update current user's profile
    updateProfile = async (req, res) => {
        try {
            const userId = req.user.id;
            const userData = req.body;
            const response = await UsersServices.updateProfile(userId, userData);
            if (response.success) {
                return res.status(200).json({ message: response.message, profile: response.profile });
            } else {
                return res.status(400).json({ message: response.message });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server Error", error });
        }
    }

    // Update profile image
    updateProfileImage = async (req, res) => {
        try {
            const userId = req.user.id;
            const file = req.file;

            if (!file) {
                return res.status(400).json({ message: "No image file provided" });
            }

            const response = await UsersServices.updateProfileImage(userId, file);
            if (response.success) {
                return res.status(200).json({ message: response.message, imageUrl: response.imageUrl });
            } else {
                return res.status(400).json({ message: response.message });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server Error", error });
        }
    }

    // Update role-specific profile (patient/doctor/donor)
    updateRoleSpecificProfile = async (req, res) => {
        try {
            const userId = req.user.id;
            const role = req.user.role;
            const roleData = req.body;

            const response = await UsersServices.updateRoleSpecificProfile(userId, role, roleData);
            if (response.success) {
                return res.status(200).json({ message: response.message, profile: response.profile });
            } else {
                return res.status(400).json({ message: response.message });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server Error", error });
        }
    }

    // Delete user profile
    deleteProfile = async (req, res) => {
        try {
            const userIdToDelete = parseInt(req.params.id);
            const requestingUserId = req.user.id;
            const requestingUserRole = req.user.role;

            const response = await UsersServices.deleteProfile(userIdToDelete, requestingUserId, requestingUserRole);
            if (response.success) {
                return res.status(200).json({ message: response.message });
            } else {
                return res.status(403).json({ message: response.message });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server Error", error });
        }
    }

    // Verify patient (admin only)
    verifyPatient = async (req, res) => {
        try {
            const patientId = parseInt(req.params.id);
            const adminRole = req.user.role;

            const response = await UsersServices.verifyPatient(patientId, adminRole);
            if (response.success) {
                return res.status(200).json({ message: response.message });
            } else {
                return res.status(403).json({ message: response.message });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server Error", error });
        }
    }
    getUserById=async(req,res)=>{
        const user=await UsersServices.getUserById(req.user.id);
        res.json({message:"Success",user});
    }
}

const usersController = new UsersController();
export default usersController;