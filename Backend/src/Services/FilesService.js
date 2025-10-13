import { FilesRepository } from "../Repositories/FilesRepository.js";
import cloudinary from "../Utils/Cloudinary.js";

export class FilesService {

    static uploadPatientFile = async (patientId, file, fileType) => {
        try {
            if (!file) {
                return { success: false, message: "No file provided" };
            }

            // Validate file type
            const validTypes = ["PATIENT_RECORD", "OTHER"];
            if (!validTypes.includes(fileType)) {
                return { success: false, message: "Invalid file type for patient" };
            }

            // Upload to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(file.path, {
                folder: "healthpal/patient-records",
                resource_type: "auto", // Supports images, PDFs, etc.
            });

            // Save file info to database
            const fileData = {
                link: uploadResult.secure_url,
                type: fileType
            };

            const result = await FilesRepository.uploadPatientFile(patientId, fileData);

            if (result.affectedRows > 0) {
                return {
                    success: true,
                    message: "File uploaded successfully",
                    file: {
                        id: result.insertId,
                        link: uploadResult.secure_url,
                        type: fileType
                    }
                };
            } else {
                return { success: false, message: "Failed to save file information" };
            }
        } catch (error) {
            return { success: false, message: "Failed to upload file", error };
        }
    }

    static uploadDoctorFile = async (doctorId, file, fileType) => {
        try {
            if (!file) {
                return { success: false, message: "No file provided" };
            }

            // Validate file type
            const validTypes = ["DOCTOR_CERTIFICATE", "OTHER"];
            if (!validTypes.includes(fileType)) {
                return { success: false, message: "Invalid file type for doctor" };
            }

            // Upload to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(file.path, {
                folder: "healthpal/doctor-certificates",
                resource_type: "auto",
            });

            // Save file info to database
            const fileData = {
                link: uploadResult.secure_url,
                type: fileType
            };

            const result = await FilesRepository.uploadDoctorFile(doctorId, fileData);

            if (result.affectedRows > 0) {
                return {
                    success: true,
                    message: "Certificate uploaded successfully",
                    file: {
                        id: result.insertId,
                        link: uploadResult.secure_url,
                        type: fileType
                    }
                };
            } else {
                return { success: false, message: "Failed to save file information" };
            }
        } catch (error) {
            return { success: false, message: "Failed to upload file", error };
        }
    }

    static getMyFiles = async (userId, role) => {
        try {
            let files;
            if (role === "PATIENT") {
                files = await FilesRepository.getPatientFiles(userId);
            } else if (role === "DOCTOR") {
                files = await FilesRepository.getDoctorFiles(userId);
            } else {
                return { success: false, message: "Invalid role for file retrieval" };
            }

            return { success: true, files };
        } catch (error) {
            return { success: false, message: "Failed to retrieve files", error };
        }
    }

    static deleteFile = async (fileId, userId, role) => {
        try {
            // Check ownership
            const isOwner = await FilesRepository.checkFileOwnership(fileId, userId, role);
            if (!isOwner && role !== "ADMIN") {
                return { success: false, message: "Unauthorized to delete this file" };
            }

            // Get file info to delete from Cloudinary
            const file = await FilesRepository.getFileById(fileId);
            if (!file) {
                return { success: false, message: "File not found" };
            }

            // Delete from database
            const result = await FilesRepository.deleteFile(fileId);
            if (result.affectedRows === 0) {
                return { success: false, message: "File not found or already deleted" };
            }

            // Optional: Delete from Cloudinary (extract public_id from URL)
            try {
                const publicId = file.link.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (cloudError) {
                console.log("Cloudinary deletion error:", cloudError);
                // Continue even if Cloudinary deletion fails
            }

            return { success: true, message: "File deleted successfully" };
        } catch (error) {
            return { success: false, message: "Failed to delete file", error };
        }
    }

    static getPatientFiles = async (patientId, requestingUserId, requestingRole) => {
        try {
            // Only patient themselves, doctors, and admins can view patient files
            if (requestingUserId !== patientId && requestingRole !== "DOCTOR" && requestingRole !== "ADMIN") {
                return { success: false, message: "Unauthorized to view these files" };
            }

            const files = await FilesRepository.getPatientFiles(patientId);
            return { success: true, files };
        } catch (error) {
            return { success: false, message: "Failed to retrieve patient files", error };
        }
    }

    static getDoctorFiles = async (doctorId) => {
        try {
            // Doctor files are public (certificates/courses)
            const files = await FilesRepository.getDoctorFiles(doctorId);
            return { success: true, files };
        } catch (error) {
            return { success: false, message: "Failed to retrieve doctor files", error };
        }
    }
}
