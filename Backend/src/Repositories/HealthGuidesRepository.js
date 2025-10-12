import { connection } from "../../Database/Connection.js";

export class HealthGuidesRepository {

   // create new guide 
static creatGuide=async ({title,content})=>{

const [result]=connection.query("'INSERT INTO health_guides (title,content) values(?,?)",[title,content]);
 return { id:result.insertId, title, content };

}
// create file 
static addFiles=async (guideId,files)=>
{
    const promises = files.map(file=>{
connection.query( 'INSERT INTO files (guide_id, link, type) VALUES (?, ?, ?)',
                [guideId, file.link, 'HEALTH_GUIDE'])
    })
       return Promise.all(promises);
}

// add translate
static addTranslate=async(guideId,translations)=>
{
const promises=translations.map(tr=>{
    connection.query( `INSERT INTO health_guide_translations
                (health_guide_id, category_en, category_ar, title_en, title_ar, content_en, content_ar)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [guideId, tr.category_en, tr.category_ar, tr.title_en, tr.title_ar, tr.content_en, tr.content_ar])
})
   return Promise.all(promises);
}




 
}
