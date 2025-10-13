import { connection } from "../../Database/Connection.js"

export class UsersRepository {

    static getAllUsers = async () => {
        const [rows] = await connection.query(
            "SELECT id, first_name, last_name, email, email_verified, profile_image_url, birth_date, phone_number, street, city, role, created_at FROM users"
        );
        return rows;
    }
    static getAllUsersCount=async()=>{
        const [rows]=await connection.query("SELECT COUNT(*) as count FROM users");
        return rows[0].count;
    }

    static getUserById = async (userId) => {
        const [rows] = await connection.query(
            "SELECT id, first_name, last_name, email, email_verified, profile_image_url, birth_date, phone_number, street, city, role, created_at FROM users WHERE id = ?",
            [userId]
        );
        return rows[0];
    }

    static updateUserProfile = async (userId, userData) => {
        const fields = [];
        const values = [];

        if (userData.first_name !== undefined) {
            fields.push("first_name = ?");
            values.push(userData.first_name);
        }
        if (userData.last_name !== undefined) {
            fields.push("last_name = ?");
            values.push(userData.last_name);
        }
        if (userData.birth_date !== undefined) {
            fields.push("birth_date = ?");
            values.push(userData.birth_date);
        }
        if (userData.phone_number !== undefined) {
            fields.push("phone_number = ?");
            values.push(userData.phone_number);
        }
        if (userData.street !== undefined) {
            fields.push("street = ?");
            values.push(userData.street);
        }
        if (userData.city !== undefined) {
            fields.push("city = ?");
            values.push(userData.city);
        }
        if (userData.profile_image_url !== undefined) {
            fields.push("profile_image_url = ?");
            values.push(userData.profile_image_url);
        }

        if (fields.length === 0) {
            return null;
        }

        values.push(userId);
        const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
        const [result] = await connection.query(query, values);
        return result;
    }

    static deleteUser = async (userId) => {
        const [result] = await connection.query(
            "DELETE FROM users WHERE id = ?",
            [userId]
        );
        return result;
    }

    // Patient-specific methods
    static getPatientProfile = async (userId) => {
        const [rows] = await connection.query(
            "SELECT user_id, insurance_number, medical_info, is_verify, created_at FROM patients WHERE user_id = ?",
            [userId]
        );
        return rows[0];
    }

    static updatePatientProfile = async (userId, patientData) => {
        const fields = [];
        const values = [];

        if (patientData.insurance_number !== undefined) {
            fields.push("insurance_number = ?");
            values.push(patientData.insurance_number);
        }
        if (patientData.medical_info !== undefined) {
            fields.push("medical_info = ?");
            values.push(patientData.medical_info);
        }

        if (fields.length === 0) {
            return null;
        }

        values.push(userId);
        const query = `UPDATE patients SET ${fields.join(", ")} WHERE user_id = ?`;
        const [result] = await connection.query(query, values);
        return result;
    }

    static verifyPatient = async (userId) => {
        const [result] = await connection.query(
            "UPDATE patients SET is_verify = 1 WHERE user_id = ?",
            [userId]
        );
        return result;
    }

    // Doctor-specific methods
    static getDoctorProfile = async (userId) => {
        const [rows] = await connection.query(
            "SELECT user_id, specialization, created_at FROM doctors WHERE user_id = ?",
            [userId]
        );
        return rows[0];
    }

    static updateDoctorProfile = async (userId, doctorData) => {
        if (doctorData.specialization === undefined) {
            return null;
        }

        const [result] = await connection.query(
            "UPDATE doctors SET specialization = ? WHERE user_id = ?",
            [doctorData.specialization, userId]
        );
        return result;
    }

    // Donor-specific methods
    static getDonorProfile = async (userId) => {
        const [rows] = await connection.query(
            "SELECT user_id, name, contact_info, created_at FROM donors WHERE user_id = ?",
            [userId]
        );
        return rows[0];
    }

    static updateDonorProfile = async (userId, donorData) => {
        const fields = [];
        const values = [];

        if (donorData.name !== undefined) {
            fields.push("name = ?");
            values.push(donorData.name);
        }
        if (donorData.contact_info !== undefined) {
            fields.push("contact_info = ?");
            values.push(donorData.contact_info);
        }

        if (fields.length === 0) {
            return null;
        }

        values.push(userId);
        const query = `UPDATE donors SET ${fields.join(", ")} WHERE user_id = ?`;
        const [result] = await connection.query(query, values);
        return result;
    }

    // Get complete profile with role-specific data
    static getCompleteProfile = async (userId) => {
        const user = await this.getUserById(userId);
        if (!user) return null;

        let roleSpecificData = null;
        if (user.role === "PATIENT") {
            roleSpecificData = await this.getPatientProfile(userId);
        } else if (user.role === "DOCTOR") {
            roleSpecificData = await this.getDoctorProfile(userId);
        } else if (user.role === "DONOR") {
            roleSpecificData = await this.getDonorProfile(userId);
        }

        return {
            ...user,
            roleSpecificData
        };
    }
}