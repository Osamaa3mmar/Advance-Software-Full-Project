import { connection } from "../../Database/Connection.js";

export class HealthGuidesRepository {

// get all guides
    static getAllGuide = async (skip = 0, limit = 5) => {
    
    const [rows] = await connection.query(
        `SELECT hg.id, hgt.title_en, hgt.title_ar, hgt.content_en, hgt.content_ar, hg.created_at
         FROM health_guides hg
         LEFT JOIN health_guide_translations hgt ON hg.id = hgt.health_guide_id
         ORDER BY hg.created_at DESC
         LIMIT ? OFFSET ?`,
        [limit, skip]
    );

   const guideId=rows.map(r=>r.id); 
   let filesMap={};

   const [files]= await connection.query( `SELECT id, guide_id, link, type  FROM files WHERE guide_id IN (?) AND type = 'HEALTH_GUIDE'`,[guideId]);

  files.forEach(
    file=>{
        if(! filesMap[file.guide_id])
        {
              filesMap[file.guide_id] = [];
        }
        filesMap[file.guide_id].push({
              id: file.id,
        url: file.link,
        type: file.type
        });
    }
  );
   
 const result = rows.map(guide => ({...guide, files: filesMap[guide.id] || []}));

    return result ;

};

   // create new guide 
static createGuide=async ()=>{

const [result] = await connection.query(
        "INSERT INTO health_guides () VALUES ()"
    );
 return { id:result.insertId};

}


// create file 
static addFiles = async (guideId, files) => {
  const promises = files.map(file => {
    return connection.query(
      'INSERT INTO files (guide_id, link, type) VALUES (?, ?, ?)',
      [guideId, file.link, 'HEALTH_GUIDE']
    );
  });
  return Promise.all(promises);
}


// add translate
static addTranslations = async (guideId, translations) => {

    const [rows] = await connection.query(
            `INSERT INTO health_guide_translations
                (health_guide_id, category_en, category_ar, title_en, title_ar, content_en, content_ar)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [guideId, translations.category_en, translations.category_ar, translations.title_en, translations.title_ar, translations.content_en, translations.content_ar]  );
    return rows;
}



static updateGuide = async (guideId, { translations, files }) => {
  // update translations  
  const [result] = await connection.query(
    `UPDATE health_guide_translations SET
      category_en = ?, category_ar = ?, title_en = ?, title_ar = ?, content_en = ?, content_ar = ?
      WHERE health_guide_id = ?`,
    [
      translations.category_en,
      translations.category_ar,
      translations.title_en, 
      translations.title_ar,
      translations.content_en,
      translations.content_ar,
      guideId
    ]
  );

  // delete old files
  await connection.query(
    "DELETE FROM files WHERE guide_id = ? AND type = 'HEALTH_GUIDE'",
    [guideId]
  );

  // add new files
  const insertedFiles = [];
  for (const file of files) {
    const [insertResult] = await connection.query(
      'INSERT INTO files (guide_id, link, type) VALUES (?, ?, ?)',
      [guideId, file.link, 'HEALTH_GUIDE']
    );
    insertedFiles.push(insertResult.insertId);
  }

  // return result
  return {
    id: guideId,
    updated: result.affectedRows > 0,
    files: insertedFiles
  };
}


// delete guide 
static deleteGuide=async(guideId)=>
{
   const [result] = await connection.query("delete from health_guides where id=?",[guideId]);
   return { deleted: result.affectedRows > 0 };
}


static searchGuides = async ({ title, content, date, skip = 0, limit = 5 }) => {
  let params = [];
  let query = "SELECT * FROM health_guide_translations WHERE 1=1 ";

  if (title) {
    query += "AND (title_en LIKE ? OR title_ar LIKE ?) ";
    params.push(`%${title}%`, `%${title}%`);
  }

  if (content) {
    query += "AND (content_en LIKE ? OR content_ar LIKE ?) ";
    params.push(`%${content}%`, `%${content}%`);
  }

  if (date) {
    query += "AND DATE(created_at) <= ? ";
    params.push(date);
  }

  query += "LIMIT ? OFFSET ?";
  params.push(limit, skip);

  const [rows] = await connection.query(query, params);
  return rows;
};



//get guide by id 
static getGuideById=async(guideId)=>
{
   const [result] = await connection.query("select * from   health_guides where id=?",[guideId]);
   return { data: result };
}

static getTotalGuidesCount=async()=>
{
   const [rows]=await connection.query("SELECT COUNT(*) as count FROM health_guides");
   return rows[0].count;

};
}



 

