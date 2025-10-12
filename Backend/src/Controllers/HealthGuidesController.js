import { HealthGuidesService } from "../Services/HealthGuidesService.js";

export class HealthGuidesController {

    static createGuide = async (req, res) => {
        const { title, content, files, translations } = req.body;
        const guide = await HealthGuidesService.createGuide({ title, content, files, translations });
        res.status(201).json(guide);
    }

   
    static getGuides = async (req, res) => {
        res.send("Health Guides Route Works!");
    }
}
