require('dotenv').config();
import models from "../models";

models().then(async (models) => {
    const { sequelize } = models;
     sequelize.sync({ force: true }).then(() => {
         console.log('Done!');
     }).catch((err:any) => {
         console.log(err);
     });
})