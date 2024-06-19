import models from "./models";

let cached:any;


export default async function databaseInit (){
    if(!cached){
        return await models();
    }
    return cached;
}