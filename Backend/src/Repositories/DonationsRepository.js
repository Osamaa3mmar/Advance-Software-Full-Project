import { connection } from "../../Database/Connection.js";

class DonationsRepository {
	static async createDonation(donationData) {
		const [result] = await connection.query(
			"INSERT INTO donations (donor_id, medical_need_id, amount, status) VALUES (?, ?, ?, ?)",
			[
				donationData.donor_id,
				donationData.medical_need_id,
				donationData.amount,
				donationData.status || "SUCCESS",
			]
		);
		return result.insertId;
	}

	static async getDonationById(id) {
		const [rows] = await connection.query(
			"SELECT * FROM donations WHERE id = ?",
			[id]
		);
		return rows[0];
	}

	static async getAllDonations() {
		const [rows] = await connection.query(
			"SELECT * FROM donations ORDER BY created_at DESC"
		);
		return rows;
	}

	static async getTotalDonationsForNeed(medicalNeedId) {
		const [rows] = await connection.query(
			"SELECT COALESCE(SUM(amount), 0) as total FROM donations WHERE medical_need_id = ? AND status = 'SUCCESS'",
			[medicalNeedId]
		);
		return parseFloat(rows[0].total);
	}

	static async getDonationsByNeed(medicalNeedId) {
		const [rows] = await connection.query(
			"SELECT * FROM donations WHERE medical_need_id = ? ORDER BY created_at DESC",
			[medicalNeedId]
		);
		return rows;
	}
}

export default DonationsRepository;
