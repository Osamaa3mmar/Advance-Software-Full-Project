import { connection } from "../../Database/Connection.js";

export class AuthRepository {
  static getUserByEmail = async (email) => {
    let [rows] = await connection.query(
      "SELECT id,email_verified,email,role,password,first_name FROM users AS user WHERE user.email=?",
      [email]
    );
    return rows[0];
  };
  static isUsedEmail = async (email) => {
    let [rows] = await connection.query(
      "SELECT count(*) FROM users AS user WHERE user.email=? ",
      [email]
    );
    return rows[0]["count(*)"];
  };
  static createUser = async (user) => {
    let [rows] = await connection.query(
      "INSERT INTO users (email,password,role) VALUES (?,?,?)",
      [user.email, user.password, user.role]
    );
    return rows;
  };
  static createPatient = async (userId) => {
    let [rows] = await connection.query(
      "INSERT INTO patients (user_id) VALUES (?)",
      [userId]
    );
    return rows;
  };
  static createDoctor = async (userId) => {
    let [rows] = await connection.query(
      "INSERT INTO doctors (user_id) VALUES (?)",
      [userId]
    );
    return rows;
  };
  static createDonor = async (userId) => {
    let [rows] = await connection.query(
      "INSERT INTO donors (user_id) VALUES (?)",
      [userId]
    );
    return rows;
  };
  static markEmailAsVerified = async (userId) => {
    await connection.query("UPDATE users SET email_verified=1 WHERE id=?", [
      userId,
    ]);
  };

  static updatePassword = async (userId, newPassword) => {
    await connection.query("UPDATE users SET password=? WHERE id=?", [
      newPassword,
      userId,
    ]);
  };
}
