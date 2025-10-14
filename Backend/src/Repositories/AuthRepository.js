import { connection } from "../../Database/Connection.js";

export class AuthRepository {
  static getUserByEmail = async (email) => {
    let [rows] = await connection.query(
      "SELECT id,email_verified,email,role,password FROM users AS user WHERE user.email=?",
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

  static isOrganizationEmailUsed = async (email) => {
    let [rows] = await connection.query(
      "SELECT count(*) FROM organizations WHERE email = ?",
      [email]
    );
    return rows[0]["count(*)"];
  };

  static createOrganization = async (organization) => {
    let [rows] = await connection.query(
      "INSERT INTO organizations (name, email, type, is_active) VALUES (?, ?, ?, ?)",
      [
        organization.name,
        organization.email,
        organization.type,
        organization.is_active,
      ]
    );
    return rows;
  };

  static getOrganizationByEmail = async (email) => {
    let [rows] = await connection.query(
      "SELECT id, email, name, type, is_active FROM organizations WHERE email = ?",
      [email]
    );
    return rows[0];
  };

  static activateOrganization = async (orgId, hashedPassword) => {
    await connection.query(
      "UPDATE organizations SET password = ?, is_active = 1 WHERE id = ?",
      [hashedPassword, orgId]
    );
  };

  static getOrganizationById = async (id) => {
    let [rows] = await connection.query(
      "SELECT * FROM organizations WHERE id = ?",
      [id]
    );
    return rows[0];
  };

  static updateOrganization = async (orgId, updateFields) => {
    const fields = Object.keys(updateFields);
    const values = Object.values(updateFields);
    const setClause = fields.map((field) => `${field}=?`).join(", ");

    await connection.query(`UPDATE organizations SET ${setClause} WHERE id=?`, [
      ...values,
      orgId,
    ]);
  };

  static updateOrganizationPassword = async (orgId, hashedPassword) => {
    await connection.query(
      "UPDATE organizations SET password = ? WHERE id = ?",
      [hashedPassword, orgId]
    );
  };
}
