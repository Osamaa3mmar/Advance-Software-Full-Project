import { connection } from "../../Database/Connection.js";

export class VerificationCodesRepository {
  static createVerificationCode = async (userId, code, type) => {
    const [result] = await connection.query(
      "INSERT INTO verification_codes (target_id,code,target_type,expires_at) VALUES (?,?,?,DATE_ADD(NOW(), INTERVAL 1 DAY))",
      [userId, code, type]
    );
    return result.insertId;
  };
}
