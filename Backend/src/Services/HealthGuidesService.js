import { HealthGuidesRepository } from "../Repositories/HealthGuidesRepository.js";

export class HealthGuidesService {

  static creatGuide = async ({ translations , files}) => {
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


static updateGuide=async(guideId,{translations,files})=>{
    
    const guide=await HealthGuidesRepository.updateGuide(guideId,{translations,files})
     return guide;
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