import { AlertRepository } from "../Repositories/AlertRepository.js";

export class AlertServices {

static getAlerts= async()=>
{
  const alert= await AlertRepository.getAlerts();
  return alert;
}




  static creatAlert = async ({ title, description, type }) => {
    const alert = await AlertRepository.creatAlert({ title, description, type });
    return alert;
  };


  static updateAlert = async (id, { title, description, type }) => {
    const alert = await AlertRepository.updateAlert(id, { title, description, type });
    return alert;
  };

  static deleteAlert = async (id) => {
    await AlertRepository.deleteAlert(id);
  };  


  static searchAlert=async({title,type})=>
  {
    const alert=await AlertRepository.searchAlert({title,type});
    return alert;
  }

  
  

  
  
}
