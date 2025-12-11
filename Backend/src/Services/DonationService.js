import DonationsRepository from "../Repositories/DonationsRepository.js";
import MedicalNeedsRepository from "../Repositories/MedicalNeedsRepository.js";
import { connection } from "../../Database/Connection.js";

class DonationService {
	static async createDonation(donationData, user) {
		// Check if user is a donor
		if (user.role !== "DONOR") {
			throw new Error("Only donors can make donations");
		}

		// Get the medical need
		const medicalNeed = await MedicalNeedsRepository.getMedicalNeedById(
			donationData.medical_need_id
		);

		if (!medicalNeed) {
			throw new Error("Medical need not found");
		}

		// Check if medical need is still pending or in progress
		if (!["PENDING", "IN_PROGRESS"].includes(medicalNeed.status)) {
			throw new Error(
				"This medical need is no longer accepting donations"
			);
		}

		// Calculate total price needed
		const totalNeeded =
			parseFloat(medicalNeed.price) * parseInt(medicalNeed.quantity);

		// Get current total donations
		const currentDonations =
			await DonationsRepository.getTotalDonationsForNeed(
				donationData.medical_need_id
			);

		const remainingAmount = totalNeeded - currentDonations;

		// Check if donation amount exceeds remaining amount
		if (parseFloat(donationData.amount) > remainingAmount) {
			throw new Error(
				`Donation amount exceeds the remaining needed amount. Remaining: ${remainingAmount.toFixed(
					2
				)}`
			);
		}

		// Create the donation
		donationData.donor_id = user.id;
		donationData.status = "SUCCESS";

		const donationId = await DonationsRepository.createDonation(
			donationData
		);

		// Calculate new total after this donation
		const newTotal = currentDonations + parseFloat(donationData.amount);

		// If total donations cover the full amount, update medical need status to FULFILLED
		if (newTotal >= totalNeeded) {
			await connection.query(
				"UPDATE medical_needs SET status = 'FULFILLED' WHERE id = ?",
				[donationData.medical_need_id]
			);
		}

		return await DonationsRepository.getDonationById(donationId);
	}

	static async getAllDonations() {
		return await DonationsRepository.getAllDonations();
	}

	static async getDonationById(id) {
		const donation = await DonationsRepository.getDonationById(id);
		if (!donation) {
			throw new Error("Donation not found");
		}
		return donation;
	}

	static async getDonationsByNeed(medicalNeedId) {
		return await DonationsRepository.getDonationsByNeed(medicalNeedId);
	}
}

export default DonationService;
