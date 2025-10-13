import { connection } from "../../Database/Connection.js";

export class FilesRepository {

    // Upload file for patient (medical records)
    static uploadPatientFile = async (patientId, fileData) => {
        const [result] = await connection.query(
            "INSERT INTO files (patient_id, link, type) VALUES (?, ?, ?)",
            [patientId, fileData.link, fileData.type]
        );
        return result;
    }

    // Upload file for doctor (certificates/courses)
    static uploadDoctorFile = async (doctorId, fileData) => {
        const [result] = await connection.query(
            "INSERT INTO files (doctor_id, link, type) VALUES (?, ?, ?)",
            [doctorId, fileData.link, fileData.type]
        );
        return result;
    }

    // Get all files for a patient
    static getPatientFiles = async (patientId) => {
        const [rows] = await connection.query(
            "SELECT id, link, type, created_at FROM files WHERE patient_id = ? ORDER BY created_at DESC",
            [patientId]
        );
        return rows;
    }

    // Get all files for a doctor
    static getDoctorFiles = async (doctorId) => {
        const [rows] = await connection.query(
            "SELECT id, link, type, created_at FROM files WHERE doctor_id = ? ORDER BY created_at DESC",
            [doctorId]
        );
        return rows;
    }

    // Get file by ID
    static getFileById = async (fileId) => {
        const [rows] = await connection.query(
            "SELECT id, patient_id, doctor_id, link, type, created_at FROM files WHERE id = ?",
            [fileId]
        );
        return rows[0];
    }

    // Delete file
    static deleteFile = async (fileId) => {
        const [result] = await connection.query(
            "DELETE FROM files WHERE id = ?",
            [fileId]
        );
        return result;
    }

    // Check if file belongs to user
    static checkFileOwnership = async (fileId, userId, role) => {
        let query = "";
        if (role === "PATIENT") {
            query = "SELECT id FROM files WHERE id = ? AND patient_id = ?";
        } else if (role === "DOCTOR") {
            query = "SELECT id FROM files WHERE id = ? AND doctor_id = ?";
        } else {
            return false;
        }

        const [rows] = await connection.query(query, [fileId, userId]);
        return rows.length > 0;
    }
}
