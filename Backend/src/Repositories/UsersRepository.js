import { connection } from "../../Database/Connection.js"
export class UsersRepository {


    static getAllUsers=async()=>{
        const [rows]=await connection.query("SELECT * FROM users");
        return rows;
    }
    static getAllUsersCount=async()=>{
        const [rows]=await connection.query("SELECT COUNT(*) as count FROM users");
        return rows[0].count;
    }
}