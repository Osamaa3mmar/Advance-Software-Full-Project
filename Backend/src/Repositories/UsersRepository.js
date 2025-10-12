import { connection } from "../../Database/Connection.js"
export class UsersRepository {


    static getAllUsers=async()=>{
        const [rows]=await connection.query("SELECT * FROM users");
        return rows;
    }
}