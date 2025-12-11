import { HealthGuidesService } from "../Services/HealthGuidesService.js";
import cloudinary from "../Utils/cloudinary.js";
import fs from "fs";
export class HealthGuidesController {

    createGuide = async (req, res) => {
    try {
        let { translations } = req.body;
        if (typeof translations === "string") {
         translations = JSON.parse(translations);
         }
      
        let files = [];
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
        const guide = await HealthGuidesService.createGuide({ translations, files });
        res.status(201).json({
            message: "Guide created successfully",
            guide,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

     getGuides = async (req, res) => {
        try {
            const skip = parseInt(req.query.skip) || 0;
            const limit = parseInt(req.query.limit) || 10;

            const guides = await HealthGuidesService.getAllGuide(skip, limit);
            res.status(200).json({ data: guides });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

 updateGuide = async (req, res) => {
    try {
        const guideId = req.params.id;
        if (!guideId) return res.status(400).json({ message: "Guide ID is required" });

        let { translations } = req.body; 
        if (typeof translations === "string") {
    translations = JSON.parse(translations);
}
        let files = [];

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

        const updatedGuide = await HealthGuidesService.updateGuide(guideId, { translations, files });

        res.status(200).json({
            message: "Guide updated successfully",
            data: updatedGuide
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

 deleteGuide = async (req, res) => {
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


   searchGuides = async (req, res) => {
  try {
    const { title, content, date, skip, limit } = req.query;

    const guides = await HealthGuidesService.searchGuides({
      title: title || null,
      content: content || null,
      date: date || null,
      skip: parseInt(skip, 10) || 0,
      limit: parseInt(limit, 10) || 5,
    });

    res.status(200).json(guides);
  } catch (err) {
    console.error("Error in searchGuides controller:", err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

      
}
const healthGuidesController=new HealthGuidesController();
export default healthGuidesController;
