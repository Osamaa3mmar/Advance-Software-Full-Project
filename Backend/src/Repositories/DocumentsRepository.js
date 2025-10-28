import { connection } from "../../Database/Connection.js";



class DocumentsRepository {
    static getRecentPendingDocuments=async ()=> {
        const [rows]=await connection.query("SELECT * FROM files WHERE status = 'Pending' ORDER BY created_at DESC LIMIT 4");
        return rows;
    }
    static uploadFileForPatient=async (file,userId)=>{
        await connection.query("INSERT INTO files (patient_id ,link,type,status) VALUES(?,?,'PATIENT_RECORD','Pending')",[userId,file]);
    }
    static getAllFiles=async ()=>{
       const [rows] = await connection.query(
  "SELECT * FROM files WHERE type IN ('DOCTOR_CERTIFICATE', 'PATIENT_RECORD')"
);
       return rows;
    }
    static checkAvaliable=async (id)=>{
        const [rows]=await connection.query("SELECT id FROM files WHERE id=? ",[id]);
        return rows.length>0?true:false;
    }
    static changeStatus=async(newStatus,id)=>{
        return await connection.query("UPDATE files SET status=? WHERE id=?",[newStatus,id])
    }
    static getById=async (id)=>{
        const [rows]=await connection.query("SELECT * FROM files WHERE id=?",[id]);
        return rows[0]
    }
}



export default DocumentsRepository;