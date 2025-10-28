import { connection } from "../../Database/Connection.js"


export class PatientsRepository{
    static makeVerify=async (userId)=>{
        await connection.query("UPDATE patients SET is_verify=1 WHERE user_id=?",[userId]);
    }
    
}