import DonationService from "../Services/DonationService.js";

class DonationController {
	static async createDonation(req, res) {
		try {
			const donation = await DonationService.createDonation(
				req.body,
				req.user
			);
			res.status(201).json(donation);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	}

	static async getAllDonations(req, res) {
		try {
			const donations = await DonationService.getAllDonations();
			res.json(donations);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}

	static async getDonationById(req, res) {
		try {
			const donation = await DonationService.getDonationById(
				req.params.id
			);
			res.json(donation);
		} catch (error) {
			res.status(404).json({ message: error.message });
		}
	}

	static async getDonationsByNeed(req, res) {
		try {
			const donations = await DonationService.getDonationsByNeed(
				req.params.needId
			);
			res.json(donations);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}
}

export default DonationController;
