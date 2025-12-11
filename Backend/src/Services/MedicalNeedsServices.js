import MedicalNeedsRepository from "../Repositories/MedicalNeedsRepository.js";

class MedicalNeedsService {
	static async getAllMedicalNeeds(user) {
		// Any logged-in user can see all medical needs
		if (!user) {
			throw new Error("Authentication required");
		}
		return await MedicalNeedsRepository.getAllMedicalNeeds(user);
	}

	static async getMedicalNeedById(id, user) {
		// Any logged-in user can see any medical need
		if (!user) {
			throw new Error("Authentication required");
		}

		const need = await MedicalNeedsRepository.getMedicalNeedById(id);
		if (!need) {
			throw new Error("Medical need not found");
		}

		return need;
	}

	static async createMedicalNeed(needData, user) {
		// Organizations can create medical needs
		if (user.role === "ORGANIZATION") {
			needData.org_id = user.organization_id;
			needData.patient_id = null;
			needData.is_request = needData.is_request || 0;
		}
		// Verified patients can create medical needs
		else if (user.role === "PATIENT") {
			// Check if patient is verified
			const isVerified =
				await MedicalNeedsRepository.checkPatientVerification(user.id);
			if (!isVerified) {
				throw new Error(
					"Only verified patients can create medical needs"
				);
			}
			needData.patient_id = user.id;
			needData.org_id = null;
			needData.is_request = 1; // Patient needs are always requests
		} else {
			throw new Error(
				"Only organizations and verified patients can create medical needs"
			);
		}

		const id = await MedicalNeedsRepository.createMedicalNeed(needData);
		return await MedicalNeedsRepository.getMedicalNeedById(id);
	}

	static async updateMedicalNeedStatus(id, newStatus, user) {
		if (!user) {
			throw new Error("Authentication required");
		}

		if (!["PENDING", "CANCELED"].includes(newStatus)) {
			throw new Error(
				"Invalid status. Only 'PENDING' or 'CANCELED' allowed."
			);
		}

		return await MedicalNeedsRepository.updateMedicalNeedStatus(
			id,
			newStatus,
			user
		);
	}
}

export default MedicalNeedsService;
