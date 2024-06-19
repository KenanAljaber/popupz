export default function (sequelize:any,dataTypes:any){
   const user= sequelize.define("user",
    {
        id: {
            type: dataTypes.UUID,
            defaultValue: dataTypes.UUIDV4,
            primaryKey: true,
        }, 
        name: {
            type: dataTypes.STRING,
            allowNull:false
        },
        email: {
            type: dataTypes.STRING,
            allowNull:false
        },
        password: {
            type: dataTypes.STRING,
            allowNull:false
        }
    }


   );
   return user;
}


export interface IUser{
    id:string,
    name:string
}