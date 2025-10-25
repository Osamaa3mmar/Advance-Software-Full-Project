import { connection } from "../../Database/Connection.js"
export class AlertRepository {


 //get all alert 
 static getAlerts=async()=>
 {
    const [result]= await connection.query("select * from alerts");
   return  result.map(alert=>{
         return { 
            id: alert.id, 
            title: alert.title, 
            description: alert.description, 
            type: alert.type 
        };
     })
 }





    // create alert
static creatAlert = async ({ title, description, type }) => {
    const [result] = await connection.query( `INSERT INTO alerts (title, description, type) VALUES (?, ?, ?)`,   [title, description, type]
    );

    return { id: result.insertId, title, description, type };
};


// update alert
static updateAlert = async (id, { title, description, type }) => {
    await connection.query(
      `UPDATE alerts SET title = ?, description = ?, type = ? WHERE id = ?`,
      [title, description, type, id]
    );  

    return { id, title, description, type };
  };
    
  // delete alert
  static deleteAlert = async (id) => {
    await connection.query(`DELETE FROM alerts WHERE id = ?`, [id]);
  };    



//search alert by name and type 
static searchAlert=async({title,type})=>
{
let params=[];
let query="select * from alerts where 1=1";
if(title)
{
query+="and title like ?";
params.push(`%${title}%`);
}

if(type)
{
query+="and type like ?";
params.push(`%${type}%`);
}

const [result]= await connection.query(query,params);
return result.map((alert)=>({
    id: alert.id,
      title: alert.title,
      description: alert.description,
      type:alert.type
}))
}

  static getTotalAlertsCount=async()=>
{
   const [rows]=await connection.query("SELECT COUNT(*) as count FROM alerts");
   return rows[0].count;

}

}