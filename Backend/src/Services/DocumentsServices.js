import { DoctorRepository } from "../Repositories/DoctorRepository.js";
import DocumentsRepository from "../Repositories/DocumentsRepository.js";
import { PatientsRepository } from "../Repositories/PatientsRepository.js";
import cloudinary from "../Utils/cloudinary.js";


class DocumentsServices {
    static  getRecentPendingDocuments=async()=> {
        const docs=await DocumentsRepository.getRecentPendingDocuments();
        return docs;
    }
    static uploadFile=async(file,user)=>{    
        if(user.role==="PATIENT"){
            let uploadedFile=(await cloudinary.uploader.upload(file.path)).secure_url;
            await DocumentsRepository.uploadFileForPatient(uploadedFile,user.id);
            return true;

        }else if(user.role==="DOCTOR"){

        }
        return null;

    }
    static getAllFiles=async ()=>{
        return await DocumentsRepository.getAllFiles();
    }
    static changeDocStatus=async(newStatus,docId)=>{
        if(!newStatus||!["Pending","Rejected","Approved"].includes(newStatus)){
            return {success:false,message:"Send New Status Or Invalid Status"}
        }
        if(!docId){
            return {success:false,message:"No Document Id Provided"}
        }

        let check=await DocumentsRepository.checkAvaliable(docId);
        
        if(!check){
            return {success:false,message:`Document With ${docId} Id Not Found .`}
        }
        let doc=await DocumentsRepository.getById(docId);
        if(doc.type==="DOCTOR_CERTIFICATE"&&newStatus=="Approved"){
            await DoctorRepository.makeVerify(doc.doctor_id);
        }else if(newStatus=="Approved") {
            await PatientsRepository.makeVerify(doc.patient_id);
        }
        await DocumentsRepository.changeStatus(newStatus,docId);
        return {success:true,message:`Document Status Change Success To ${newStatus}`};
    }
}


export default DocumentsServices;