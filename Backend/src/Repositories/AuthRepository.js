import { connection } from "../../Database/Connection.js"

export class AuthRepository{

    static isUsedEmail=async(email)=>{
        let [rows]=await connection.query("SELECT count(*) FROM users AS user WHERE user.email=? ",[email]);
        console.log(rows);
        return rows[0]["count(*)"];
    }
    static createUser=async(user)=>{
        let [rows]=await connection.query("INSERT INTO users (email,password) VALUES (?,?)",[user.email,user.password]);
        return rows;
    }
    static createPatient=async(userId)=>{
        let [rows]=await connection.query("INSERT INTO patients (user_id) VALUES (?)",[userId]);
        return rows;
    }
    static createDoctor=async(userId)=>{
        let [rows]=await connection.query("INSERT INTO doctors (user_id) VALUES (?)",[userId]);
        return rows;
    }
    static createDonor=async(userId)=>{
        let [rows]=await connection.query("INSERT INTO donors (user_id) VALUES (?)",[userId]);
        return rows;
    }

}


