import { WorkshopsRepository } from "../Repositories/WorkshopsRepository.js";

export class WorkshopsService {
	static createWorkshop = async ({
		title,
		description,
		type,
		link,
		location,
	}) => {
		// basic validation
		if (!title) throw new Error("Title is required");

		// ensure type is one of allowed values
		const allowedTypes = [
			"HEALTH_EDUCATION",
			"TRAINING",
			"WEBINAR",
			"ONLINE_COURSE",
			"WORKSHOP",
			"OTHER",
		];
		const finalType = allowedTypes.includes(type) ? type : "OTHER";

		const workshop = await WorkshopsRepository.createWorkshop({
			title,
			description,
			type: finalType,
			link,
			location,
		});

		return workshop;
	};

	static getAllWorkshops = async () => {
		return await WorkshopsRepository.getAllWorkshops();
	};

	static getWorkshopById = async (id) => {
		return await WorkshopsRepository.getWorkshopById(id);
	};

	static editWorkshop = async (id, updates) => {
		// sanitize allowed updates
		const allowed = ["title", "description", "type", "link", "location"];
		const payload = {};
		Object.keys(updates || {}).forEach((k) => {
			if (allowed.includes(k)) payload[k] = updates[k];
		});

		if (Object.keys(payload).length === 0) return null;

		return await WorkshopsRepository.editWorkshop(id, payload);
	};

	static deleteWorkshop = async (id) => {
		return await WorkshopsRepository.deleteWorkshop(id);
	};
}

export default WorkshopsService;
