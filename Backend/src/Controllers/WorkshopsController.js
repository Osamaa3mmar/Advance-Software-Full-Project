import { WorkshopsService } from "../Services/WorkshopsService.js";

class WorkshopsController {
	createWorkshop = async (req, res) => {
		const { title, description, zoom_link, scheduled_at } = req.body;
		const link = zoom_link ?? req.body.link ?? null; // normalize field name
		const createdBy = req.user?.id ?? null;
		const workshop = await WorkshopsService.createWorkshop({
			title,
			description,
			link,
			scheduled_at,
			createdBy,
		});
		res.status(201).json({ message: "Workshop created", workshop });
	};

	getWorkshops = async (req, res) => {
		const workshops = await WorkshopsService.getAllWorkshops();
		res.json({ message: "Success", workshops });
	};

	getWorkshopById = async (req, res) => {
		const { id } = req.params;
		const workshop = await WorkshopsService.getWorkshopById(id);
		if (!workshop)
			return res.status(404).json({ message: "Workshop not found" });
		res.json({ message: "Success", workshop });
	};

	editWorkshops = async (req, res) => {
		const { id } = req.params;
		const { title, description, zoom_link, scheduled_at } = req.body;
		const link = zoom_link ?? req.body.link ?? null;
		const updated = await WorkshopsService.editWorkshop(id, {
			title,
			description,
			link,
			scheduled_at,
		});
		if (!updated) {
			return res.status(404).json({ message: "Workshop not found" });
		}
		res.json({ message: "Workshop updated", workshop: updated });
	};

	deleteWorkshop = async (req, res) => {
		const { id } = req.params;
		const deleted = await WorkshopsService.deleteWorkshop(id);
		if (!deleted) {
			return res.status(404).json({ message: "Workshop not found" });
		}
		res.json({ message: "Workshop deleted" });
	};
}

const workshopsController = new WorkshopsController();
export default workshopsController;
