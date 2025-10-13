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

    return { data: result };

};

   // create new guide 
static creatGuide=async ()=>{

const [result] = await connection.query(
        "INSERT INTO health_guides () VALUES ()"
    );
 return { id:result.insertId};

}


// create file 
static addFiles=async (guideId,files)=>
{
    const promises = files.map(file=>{
connection.query( 'insert into files (guide_id, link, type) VALUES (?, ?, ?)',
                [guideId, file.link, 'HEALTH_GUIDE'])
    })
       return Promise.all(promises);
}

// add translate
static addTranslations = async (guideId, translations) => {
    const promises = translations.map(tr => {
         connection.query(
            `INSERT INTO health_guide_translations
                (health_guide_id, category_en, category_ar, title_en, title_ar, content_en, content_ar)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [guideId, tr.category_en, tr.category_ar, tr.title_en, tr.title_ar, tr.content_en, tr.content_ar]
        );
    });
    return Promise.all(promises);

}


//update guide 
static updateGuide = async (guideId, { translations, files }) => {
        const translationPromises = translations.map(tr =>
            connection.query(
                `UPDATE health_guide_translations
                 SET category_en = ?, category_ar = ?, title_en = ?, title_ar = ?, content_en = ?, content_ar = ?
                 WHERE health_guide_id = ?`,
                [tr.category_en, tr.category_ar, tr.title_en, tr.title_ar, tr.content_en, tr.content_ar, guideId]
            )
        );

        await Promise.all(translationPromises);
    
   
       const deleteFiles= await connection.query("DELETE FROM files WHERE guide_id = ? AND type='HEALTH_GUIDE'", [guideId]);
        const filePromises = files.map(file =>
            connection.query(
                "INSERT INTO files (guide_id, link, type) VALUES (?, ?, 'HEALTH_GUIDE')",
                [guideId, file.link]
            )
        );
        await Promise.all(filePromises);
    
    
    const [updatedTranslations] = await connection.query(
        "SELECT * FROM health_guide_translations WHERE health_guide_id = ?",
        [guideId]
    );

    const [updatedFiles] = await connection.query(
        "SELECT id, link AS url, type FROM files WHERE guide_id = ? AND type='HEALTH_GUIDE'",
        [guideId]
    );

    return { guideId, translations: updatedTranslations, files: updatedFiles };
}




// delete guide 
static deleteGuide=async(guideId)=>
{
   const [result] = await connection.query("delete from health_guides where id=?",[guideId]);
   return { deleted: result.affectedRows > 0 };
}







static searchGuides = async ({ query = "", dateBefore, dateAfter, skip = 0, limit = 5 }) => {
    let conditions = [];
    let params = [];

   
    if (query) {
        const likeQuery = `%${query}%`;
        conditions.push(`(hgt.title_en LIKE ? OR hgt.title_ar LIKE ? OR hgt.content_en LIKE ? OR hgt.content_ar LIKE ?)`);
        params.push(likeQuery, likeQuery, likeQuery, likeQuery);
    }

    if (dateBefore) {
        conditions.push(`hg.created_at <= ?`);
        params.push(dateBefore);
    }

    
    if (dateAfter) {
        conditions.push(`hg.created_at >= ?`);
        params.push(dateAfter);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const [rows] = await connection.query(
        `SELECT hg.id, hg.created_at, hgt.title_en, hgt.title_ar, hgt.content_en, hgt.content_ar
         FROM health_guides hg
         LEFT JOIN health_guide_translations hgt ON hg.id = hgt.health_guide_id
         ${whereClause}
         ORDER BY hg.created_at DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, skip]
    );


    return { data: rows };
};


}






 

