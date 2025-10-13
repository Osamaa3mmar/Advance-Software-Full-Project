import { HealthGuidesService } from "../Services/HealthGuidesService.js";
import cloudinary from "../Utils/cloudinary.js";
import fs from "fs";
export class HealthGuidesController {

   static createGuide = async (req, res) => {
    try {
        let { translations } = req.body;
        let files = [];

      
        if (typeof translations === "string") {
            translations = JSON.parse(translations);
        }

        if (!Array.isArray(translations) || translations.length === 0) {
            return res.status(400).json({ message: "At least one translation is required." });
        }

   
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "guides",
                    resource_type: "auto",
                });
                files.push({ link: result.secure_url });
                fs.unlinkSync(file.path);
            }
        }

     
        const guide = await HealthGuidesService.creatGuide({ translations, files });

        res.status(201).json({
            message: "Guide created successfully",
            guide,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

    static getGuides = async (req, res) => {
        try {
            const skip = parseInt(req.query.skip) || 0;
            const limit = parseInt(req.query.limit) || 10;

            const guides = await HealthGuidesService.getAllGuide(skip, limit);
            res.status(200).json({ data: guides });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

static updateGuide = async (req, res) => {
    try {
        const guideId = req.params.id;
        const { translations, files } = req.body;

        const updatedGuide = await HealthGuidesService.updateGuide(guideId, { translations, files });
        res.status(200).json({ message: "Guide updated successfully", data: updatedGuide });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

static deleteGuide = async (req, res) => {
    try {
        const guideId = req.params.id;        
        const result = await HealthGuidesService.deleteGuide(guideId);
        if (result.deleted) {
            res.status(200).json({ message: "Guide deleted successfully" });
        } else {
            res.status(404).json({ message: "Guide not found" });
        }          
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


    static searchGuides = async (req, res) => {
        try {
            const { query, dateBefore, dateAfter, skip, limit } = req.query;

            const guides = await HealthGuidesService.searchGuides({
                query,
                dateBefore,
                dateAfter,
                skip: parseInt(skip) || 0,
                limit: parseInt(limit) || 5
            });

            res.status(200).json(guides);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
}
      
}
