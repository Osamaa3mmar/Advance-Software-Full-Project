import { connection } from "../../Database/Connection.js";

class MedicalNeedsRepository {
	static async getAllMedicalNeeds() {
		const [rows] = await connection.query(
			"SELECT * FROM medical_needs WHERE status IN ('PENDING', 'IN_PROGRESS') ORDER BY created_at DESC"
		);
		return rows;
	}

	static async getMedicalNeeconnectionyId(id) {
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

	static async createMedicalNeed(needData) {
		const [result] = await connection.query(
			"INSERT INTO medical_needs (name, description, type, price, quantity, org_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
			[
				needData.name,
				needData.description,
				needData.type,
				needData.price,
				needData.quantity,
				needData.org_id,
				"PENDING",
			]
		);
		return result.insertId;
	}
}

export default MedicalNeedsRepository;
