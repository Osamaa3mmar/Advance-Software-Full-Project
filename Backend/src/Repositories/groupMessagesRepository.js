
import { connection } from "../../Database/Connection.js";

export class groupMessagesRepository 
{

  static  findMember=async(groupId, userId)=> {
    const [rows] = await connection.query(
      `SELECT status, state FROM group_member WHERE group_id = ? AND user_id = ?`,
      [groupId, userId]
    );
    return rows;
  }


  static  insertMessage=async(groupId, userId, message, assetLink)=> {
    await connection.query(
      `INSERT INTO group_messages (group_id, user_id, message, asset_link)
       VALUES (?, ?, ?, ?)`,
      [groupId, userId, message, assetLink]
    );
  }


static async findGroupById(groupId) {
    const [rows] = await connection.query(
      `SELECT * FROM support_groups WHERE id = ?`,  [groupId]  );
    return rows;
   }


  static async getMessagesByGroup(groupId) {
    const [rows] = await connection.query(
      `SELECT 
          m.id,
          m.message,
          m.asset_link,
          m.created_at,
          u.first_name,
          u.last_name
       FROM group_messages m
       LEFT JOIN users u ON m.user_id = u.id
       WHERE m.group_id = ?
       ORDER BY m.created_at ASC`,
      [groupId]
    );
    return rows;
  }


    









}