import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { databaseMiddleware } from "../middlewares/databaseMiddleware";
import PopupService from "../services/pupupSerivce";

const app=express();
app.use(cors());
app.use(bodyParser.json());
app.use(databaseMiddleware);

app.post("/popup", async (req, res) => {
    console.log(`[+] Popup request received:`,req.body);
    if(!req.body) return res.status(400).send({data:"data is required"});
    const data=req.body.popupsData;
    const script= await PopupService.generatePopupTag(data);

     res.status(200).send(script);

})
app.get("/popup", async (req, res) => {
    console.log(`[+] Popup request received: `);
    return res.send({data:"test"});
    

})



export default app;