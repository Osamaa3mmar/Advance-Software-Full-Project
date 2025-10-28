import DocumentsServices from "../Services/DocumentsServices.js";

class DocumentsController {
  getRecentPendingDocuments = async (req, res) => {
    try {
      const documents = await DocumentsServices.getRecentPendingDocuments();
      res.status(200).json(documents);
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
  };

  uploadDocument = async (req, res) => {
    try {
      const user = req.user;

      const file = req.files.document[0];
      const response = await DocumentsServices.uploadFile(file, user);
      if (!response) {
        return res.status(400).json({ message: "Error" });
      }

      return res.status(201).json({ message: "Success" });
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  };

  getAllFiles = async (req,res) => {
    try {
      const files=await DocumentsServices.getAllFiles();
      return res.status(200).json({message:"Success",files});
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  };

  changeDocStatus=async (req,res)=>{
    // try{
      const {newStatus}=req.body;
      const {docId}=req.params;
      console.log(docId,newStatus);
      const response=await DocumentsServices.changeDocStatus(newStatus,docId);
      if(response.success){
        return res.status(200).json({message:response.message});
      }
      return res.status(400).json({message:response.message});
    // }catch (error) {
    //   return res.status(500).json({ message: "Server Error", error });
    // }
  }
}

const documentsController = new DocumentsController();
export default documentsController;
