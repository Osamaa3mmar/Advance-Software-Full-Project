import  { groupMessagesServices } from '../Services/groupMessagesServices.js';
import cloudinary from "../Utils/cloudinary.js";

export class GroupMessagesContoller 
{
 
     sendMessage = async (req, res) => {
    try {
      const { groupId, userId, message } = req.body;
      let fileUrl = null;
      if (req.file) {
        const file = await cloudinary.uploader.upload(req.file.path, {
          folder: "group_patient_file",
          resource_type: "auto",
        });
        fileUrl = file.secure_url;
      }
      const result = await groupMessagesServices.sendMessage(
        groupId,
        userId,
        message,
        fileUrl
      );

      res.status(200).json(result);
    } catch (err) {
      console.error("Error sending message:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  

  getAllMessages=async(req,res)=>
  {
  try {
      const groupId = req.params.groupId;
      const result = await groupMessagesServices.getAllMessages(groupId);
      res.status(200).json(result);
    } catch (err) {
      console.error("Error getting group messages:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  
}
const groupMessagesContoller= new GroupMessagesContoller();
export default groupMessagesContoller;