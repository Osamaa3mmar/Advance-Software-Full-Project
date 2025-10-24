import { AlertServices } from "../Services/AlertServices.js";

 class AlertControllers {

  getAlerts=async (req,res)=>{
    try
    {
      const alerts= await AlertServices.getAlerts();
      return res.status(200).json({alerts});     

    }
    catch(err)
    {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  }

   createAlert = async (req, res) => {
    try {
      const { title, description, type } = req.body;
    
      if (!title || !description || !type) {
        return res.status(400).json({ message: "Title, description, and type are required." });
      }

      const alert = await AlertServices.creatAlert({ title, description, type });
  
      return res.status(201).json({ message: "Alert created successfully", alert });

    } catch (err) {
 
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  };
 
   updateAlert = async (req, res) => {          
    try {
      const { id } = req.params;
      const { title, description, type } = req.body;    
      if (!title || !description || !type) {          
        return res.status(400).json({ message: "Title, description, and type are required." });
      }

      const alert = await AlertServices.updateAlert(id, { title, description, type });    
      return res.status(200).json({ message: "Alert updated successfully", alert });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }   
  };
   deleteAlert = async (req, res) => {          
    try {
      const { id } = req.params;    
      await AlertServices.deleteAlert(id);    
      return res.status(200).json({ message: "Alert deleted successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }     
  };



}

const alertControllers= new AlertControllers();
export default alertControllers;
