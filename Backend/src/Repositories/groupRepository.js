import { connection } from "../../Database/Connection.js";

export class groupRepository
{

// create group
static createGroup=async({name,description,category,createdBy })=>
{
   const [result]=await connection.query("insert into support_groups (name,description,category,created_by ) values(?,?,?,?)",[name,description,category,createdBy ]); 
    return result.insertId;
}
// get all groups
static getAllGroups=async()=>
{
    const [rows]=await connection.query( `SELECT * FROM support_groups`);
   return rows;
}

//user sends join request 
static sendJoinRequest=async(groupId,userId)=>
{
    const [exisit]=await connection.query(`SELECT * FROM group_member WHERE group_id = ? AND user_id = ? AND state=?`,[groupId,userId,'PENDING']);
    if (exisit.length>0) return "already existing";
  await connection.query( `INSERT INTO group_member (group_id, user_id, state) VALUES (?, ?, 'PENDING')`, [groupId, userId]
    );
    return "pending";
}


// Admin views all requests
  static async getGroupRequests(groupId) {
    const [rows] = await connection.query(
      `SELECT r.id, u.first_name,r.state
       FROM group_member r
       JOIN users u ON r.user_id = u.id
       WHERE r.group_id = ? and r.state="PENDING"`,
      [groupId]
    );
    return rows;
  }

  // admin accepts or rejects a request 
  static updateReqStatus=async (requestId,state)=>
  {
    // to check if req is existing
 const [req]= await connection.query(`select * from group_member WHERE id =?`,[requestId]);
 if (req.length==0) return "not_found";   

   const currentStatus = req[0].state;

 if (currentStatus !== "PENDING") {
    return "already_processed";
  }

  await connection.query(
    `UPDATE  group_member SET state = ? WHERE id = ?`,
    [state, requestId]
  );


    if (state === "APPROVED") {
    await connection.query(
      `UPDATE group_member SET role = 'MEMBER', status = 'ACTIVE' WHERE id = ?`,
      [requestId]
    );
  }

  return state;
  }


//update the information of group 
static updateInfoGruop=async(groupId,{name,category,description})=>
{
const [result]=await connection.query(`update support_groups set name=?,category=?,description=? where id=?`,[name,category,description,groupId]);
return result;

}


}