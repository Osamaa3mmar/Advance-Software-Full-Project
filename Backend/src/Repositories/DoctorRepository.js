import { connection } from "../../Database/Connection.js"


export class DoctorRepository{
    static makeVerify=async (userId)=>{
        await connection.query("UPDATE doctors SET is_verify=1 WHERE user_id=?",[userId]);
    }
    
}