import { HealthGuidesRepository } from "../Repositories/HealthGuidesRepository.js";

export class HealthGuidesService {

    static createGuide = async ({ title, content, files, translations }) => {
        const guide = await HealthGuidesRepository.createGuide({ title, content });

        if (files && files.length > 0) {
            await HealthGuidesRepository.addFiles(guide.id, files);
        }

        if (translations && translations.length > 0) {
            await HealthGuidesRepository.addTranslations(guide.id, translations);
        }

        return guide;
    }
}
