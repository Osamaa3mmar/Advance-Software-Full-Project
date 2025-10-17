import { HealthGuidesRepository } from "../Repositories/HealthGuidesRepository.js";

export class HealthGuidesService {

  static createGuide = async ({ translations , files}) => {
    const guide = await HealthGuidesRepository.creatGuide();

if(files && files.length > 0)
{
      await HealthGuidesRepository.addFiles(guide.id, files);
}
  

    if (translations && translations.length > 0) {
        await HealthGuidesRepository.addTranslations(guide.id, translations);
    }

    return guide;
};


    static getAllGuide=async(skip,limit)=>
    {
        const guides=await HealthGuidesRepository.getAllGuide(skip,limit);
        return guides;
    }


static updateGuide=async(guideId,{translations,files})=>
    {
         if(!guideId)
         {
              throw new Error("Invalid or missing guideId");
         }
         
    if (!translations || typeof translations !== "object") {
    throw new Error("Translation not valid");
}
    
    let normalizedFiles = [];
  if (Array.isArray(files)) {
    normalizedFiles = files;
  } else if (files && typeof files === "object") {
    normalizedFiles = [files];
  }


  for (const file of normalizedFiles) {
    if (!file.link || typeof file.link !== "string") {
      throw new Error("Each file must contain a valid 'link'");
    }
  }

    const existing = await HealthGuidesRepository.getGuideById(guideId);
  if (!existing) {
    throw new Error("Guide not found");
  }


   const updatedGuide = await HealthGuidesRepository.updateGuide(guideId, {
    translations,
    files: normalizedFiles
  })
}



static deleteGuide=async(guideId)=>
    {
    const result=await HealthGuidesRepository.deleteGuide(guideId)
    return result;              

    }

   static searchGuides = async (filters) => {
        return await HealthGuidesRepository.searchGuides(filters);
    }
}