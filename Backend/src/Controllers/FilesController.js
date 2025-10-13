import { FilesService } from "../Services/FilesService.js";

class FilesController {

    // Upload file for patient (medical records)
    uploadPatientFile = async (req, res) => {
        try {
            const userId = req.user.id;
            const role = req.user.role;
            const file = req.file;
            const fileType = req.body.type || "PATIENT_RECORD";

            if (role !== "PATIENT") {
                return res.status(403).json({ message: "Only patients can upload medical records" });
            }

            if (!file) {
                return res.status(400).json({ message: "No file provided" });
            }

            const response = await FilesService.uploadPatientFile(userId, file, fileType);
            if (response.success) {
                return res.status(201).json({ 
                    message: response.message, 
                    file: response.file 
                });
            } else {
                return res.status(400).json({ message: response.message });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server Error", error });
        }
    }

    // Upload file for doctor (certificates/courses)
    uploadDoctorFile = async (req, res) => {
        try {
            const userId = req.user.id;
            const role = req.user.role;
            const file = req.file;
            const fileType = req.body.type || "DOCTOR_CERTIFICATE";

            if (role !== "DOCTOR") {
                return res.status(403).json({ message: "Only doctors can upload certificates" });
            }

            if (!file) {
                return res.status(400).json({ message: "No file provided" });
            }

            const response = await FilesService.uploadDoctorFile(userId, file, fileType);
            if (response.success) {
                return res.status(201).json({ 
                    message: response.message, 
                    file: response.file 
                });
            } else {
                return res.status(400).json({ message: response.message });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server Error", error });
        }
    }

    // Get current user's files
    getMyFiles = async (req, res) => {
        try {
            const userId = req.user.id;
            const role = req.user.role;

            const response = await FilesService.getMyFiles(userId, role);
            if (response.success) {
                return res.status(200).json({ 
                    message: "Files retrieved successfully", 
                    files: response.files 
                });
            } else {
                return res.status(400).json({ message: response.message });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server Error", error });
        }
    }

    // Get patient files (by patient ID - for doctors/admins)
    getPatientFiles = async (req, res) => {
        try {
            const patientId = parseInt(req.params.patientId);
            const requestingUserId = req.user.id;
            const requestingRole = req.user.role;

            const response = await FilesService.getPatientFiles(patientId, requestingUserId, requestingRole);
            if (response.success) {
                return res.status(200).json({ 
                    message: "Patient files retrieved successfully", 
                    files: response.files 
                });
            } else {
                return res.status(403).json({ message: response.message });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server Error", error });
        }
    }

    // Get doctor files (public - certificates)
    getDoctorFiles = async (req, res) => {
        try {
            const doctorId = parseInt(req.params.doctorId);

            const response = await FilesService.getDoctorFiles(doctorId);
            if (response.success) {
                return res.status(200).json({ 
                    message: "Doctor certificates retrieved successfully", 
                    files: response.files 
                });
            } else {
                return res.status(400).json({ message: response.message });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server Error", error });
        }
    }

    // Delete file
    deleteFile = async (req, res) => {
        try {
            const fileId = parseInt(req.params.fileId);
            const userId = req.user.id;
            const role = req.user.role;

            const response = await FilesService.deleteFile(fileId, userId, role);
            if (response.success) {
                return res.status(200).json({ message: response.message });
            } else {
                return res.status(403).json({ message: response.message });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server Error", error });
        }
    }
}

const filesController = new FilesController();
export default filesController;
