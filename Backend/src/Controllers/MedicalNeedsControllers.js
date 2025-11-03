import MedicalNeedsService from "../Services/MedicalNeedsServices.js";

class MedicalNeedsController {
	static async getMedicalNeeds(req, res) {
		try {
			const needs = await MedicalNeedsService.getAllMedicalNeeds(
				req.user
			);
			res.json(needs);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}

	static async getMedicalNeedById(req, res) {
		try {
			const need = await MedicalNeedsService.getMedicalNeedById(
				req.params.id,
				req.user
			);
			res.json(need);
		} catch (error) {
			if (error.message.includes("Not authorized")) {
				res.status(403).json({ message: error.message });
			} else if (error.message.includes("Authentication required")) {
				res.status(401).json({ message: error.message });
			} else {
				res.status(404).json({ message: error.message });
			}
		}
	}

	static async createMedicalNeed(req, res) {
		try {
			const need = await MedicalNeedsService.createMedicalNeed(
				req.body,
				req.user
			);
			res.status(201).json(need);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	}
}

export default MedicalNeedsController;
