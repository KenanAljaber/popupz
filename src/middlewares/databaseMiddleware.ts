import databaseInit from "../database/databaseConnection"

export async function databaseMiddleware (req:any,res:any,next:any){
    try {
        const database= await databaseInit();
        req.database=database;

    } catch (error) {
        console.log(error);
        
    }finally{
        next();
    }
}