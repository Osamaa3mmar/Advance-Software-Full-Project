import { connection } from "../../Database/Connection.js";

export class VerificationCodesRepository {
  static createVerificationCode = async (userId, code, type) => {
    const [result] = await connection.query(
      "INSERT INTO verification_codes (target_id,code,target_type,expires_at) VALUES (?,?,?,DATE_ADD(NOW(), INTERVAL 1 DAY))",
      [userId, code, type]
    );
    return result.insertId;
  };
  static findValidCode = async (code, type) => {
    const [rows]=await connection.query("SELECT * FROM verification_codes WHERE code=? AND target_type=? AND expires_at>NOW() AND is_used=0", [code, type]);
    return rows[0];
  }
  static markCodeAsUsed = async (id) => {
    await connection.query("UPDATE verification_codes SET is_used=1 WHERE id=?", [id]); 
  };
}
