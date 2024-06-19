import { DataTypes, Sequelize } from "sequelize";
import fs from "fs";
import path, { basename } from "path";
require('dotenv').config({ path: '.env.development' });
//extract the current file name from the entire path
const currentFileName = path.basename(module.filename);

export default async function models () {
    const database:any={};
    // directories with models
    const modelDirectories=[__dirname];

    // init database 
    let sequelize = new (<any>Sequelize)(
        process.env.DATABASE_NAME,
        process.env.DATABASE_USER,
        process.env.DATABASE_PASSWORD,
        {
            host: process.env.DATABASE_HOST,
            dialect: process.env.DATABASE_DIALECT,
            port: process.env.DATABASE_PORT,
            // logging: true,
        }
    );
    // load all models from the models directory
    modelDirectories.forEach((dir)=>{
        fs.readdirSync(dir).filter((file)=> {
            return (
                file.indexOf(".") != 0 &&
             (file.slice(-3) == '.js' || file.slice(-3) == ".ts") &&
             file!= currentFileName )
        }).forEach((file)=>{
            const model = require(path.join(dir,file)).default(sequelize,DataTypes);
            database[model.name]=model;
        });
    });
    // if any model has an association we should load it 
    Object.keys(database).forEach((modelName)=>{
        if(database[modelName].associate){
            database[modelName].associate(database);
        }
    });
    // add the sequelize object to the database
    database.sequelize=sequelize;
    //return the database;
    return database;

}
