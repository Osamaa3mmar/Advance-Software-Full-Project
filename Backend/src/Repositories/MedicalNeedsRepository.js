import { connection } from "../../Database/Connection.js";

class MedicalNeedsRepository {
	static async getAllMedicalNeeds(user) {
		// All logged-in users can see all medical needs
		const query =
			"SELECT * FROM medical_needs WHERE status IN ('PENDING', 'IN_PROGRESS') ORDER BY created_at DESC";
		const [rows] = await connection.query(query);
		return rows;
	}

	static async getMedicalNeedById(id) {
		const [rows] = await connection.query(
			"SELECT * FROM medical_needs WHERE id = ?",
			[id]
		);
		return rows[0];
	}

	static async getPatientMedicalNeeds(patientId) {
		const [rows] = await connection.query(
			"SELECT * FROM medical_needs WHERE patient_id = ? AND status IN ('PENDING', 'IN_PROGRESS') ORDER BY created_at DESC",
			[patientId]
		);
		return rows;
	}

	static async getOrganizationMedicalNeeds(orgId) {
		const [rows] = await connection.query(
			"SELECT * FROM medical_needs WHERE org_id = ? AND status IN ('PENDING', 'IN_PROGRESS') ORDER BY created_at DESC",
			[orgId]
		);
		return rows;
	}

	static async checkPatientVerification(userId) {
		const [rows] = await connection.query(
			"SELECT is_verify FROM patients WHERE user_id = ?",
			[userId]
		);
		return rows[0]?.is_verify === 1;
	}

	static async createMedicalNeed(needData) {
		const [result] = await connection.query(
			"INSERT INTO medical_needs (name, description, type, price, quantity, org_id, patient_id, is_request, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
			[
				needData.name,
				needData.description,
				needData.type,
				needData.price || 0,
				needData.quantity || 0,
				needData.org_id || null,
				needData.patient_id || null,
				needData.is_request || 0,
				"PENDING",
			]
		);
		return result.insertId;
	}

	static async updateMedicalNeedStatus(id, newStatus, user) {
		if (!["PENDING", "CANCELED"].includes(newStatus)) {
			throw new Error(
				"Invalid status. Only 'PENDING' or 'CANCELED' allowed."
			);
		}

		let condition;
		let params = [newStatus, id];

		if (user.role === "PATIENT") {
			condition = "patient_id = ?";
			params.push(user.patient_id);
		} else if (user.role === "ORGANIZATION") {
			condition = "org_id = ?";
			params.push(user.organization_id);
		} else {
			throw new Error(
				"Only patients and organizations can update status."
			);
		}

		const [result] = await connection.query(
			`UPDATE medical_needs SET status = ? WHERE id = ? AND ${condition}`,
			params
		);

		if (result.affectedRows === 0) {
			throw new Error(
				"Medical need not found or not authorized to update."
			);
		}

		return result.affectedRows > 0;
	}
}

export default MedicalNeedsRepository;
