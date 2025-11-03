import MedicalNeedsRepository from "../Repositories/MedicalNeedsRepository.js";

class MedicalNeedsService {
	static async getAllMedicalNeeds(user) {
		// Any logged in user can see all medical needs
		if (!user) {
			throw new Error("Authentication required");
		}
		return await MedicalNeedsRepository.getAllMedicalNeeds();
	}

	static async getMedicalNeedById(id, user) {
		// Any logged in user can see any medical need
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
		if (!user.organization_id) {
			throw new Error("Only organizations can create medical needs");
		}

		needData.org_id = user.organization_id;
		const id = await MedicalNeedsRepository.createMedicalNeed(needData);
		return await MedicalNeedsRepository.getMedicalNeedById(id);
	}
}

export default MedicalNeedsService;
