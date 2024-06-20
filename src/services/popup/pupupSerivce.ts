import fs from "fs";
import path from "path";
import { readFile, writeFile } from 'fs/promises';
import S3Service from "../aws/s3Service";
import { Readable } from "stream";
import { POPUP_ACTIONS, POPUP_DEFAULT_TIME_IN_SECONDS, TIME_UNITS } from "../../utils/constants";
export default class PopupService{


    static async  generatePopupTag(popupDataArray:IPopupData[]){
        try {
            // Read the template file asynchronously
            const templatePath = './src/template/index.js';
            const template = await readFile(templatePath, "utf8");
            console.log("the template loaded is :",template.length);
            popupDataArray.forEach(popupData => {
              if(!popupData.time) popupData.time = "NOW"
              if (popupData.duration) {
                  if (!popupData.timeUnit) popupData.timeUnit = TIME_UNITS.SECONDS;
                  let timeInt;
                  try {
                      timeInt = parseInt(popupData.duration);
                      if (popupData.timeUnit.toLowerCase() === TIME_UNITS.SECONDS) {
                          timeInt = timeInt * 1000;
                      } else {
                          timeInt = timeInt * 60 * 1000;
                      }
                      popupData.duration = timeInt.toString();
                  } catch (error) {
                      popupData.duration = (POPUP_DEFAULT_TIME_IN_SECONDS * 1000).toString();
                  }
              }
              this.processPopupActions(popupData);
          });


            // Perform replacements of the array called popupsArr
           const popupArrString= JSON.stringify(popupDataArray,null,2);
           const modifiedTemplate = template.replace("{{popupsArr}}", popupArrString);
             
        
            // Define the output file path with a timestamp
            const outputFileName = `index${Date.now()}.js`;
            const outputPath = `./outputTemplates/${outputFileName}`
        
            // Write the modified content to the new file asynchronously
             await writeFile(outputPath, modifiedTemplate);

            const fileBuffer=  fs.readFileSync(outputPath);

            const fileStream= Readable.from(fileBuffer);
          
            const file: Express.Multer.File = {
              fieldname: 'file',
              originalname: outputFileName,
              encoding: '7bit',
              mimetype: 'application/javascript',
              size: fileBuffer.length,
              buffer: fileBuffer,
              destination: '', // Not needed for in-memory storage
              filename: outputFileName,
              path: outputPath,
              stream: fileStream, // Not needed for in-memory storage
            };
        
            const fileUrl = await new S3Service().uploadFile(file);
            
            // Delete the generated file
            fs.unlinkSync(outputPath);
            console.log(`[+] Script is : <script src="${fileUrl}"></script>`);
            
            // Return an HTML <script> tag with the new JS file as the source
            return `<script src="${fileUrl}"></script>`;
          } catch (error) {
            console.error('Error generating popup tag:', error);
            throw error; // Re-throw the error after logging it
          }
    }
    static processPopupActions(popupData: IPopupData) {
        switch (popupData.cta?.action) {
            case POPUP_ACTIONS.WHATSAPP:
                popupData.cta.url = "https://wa.me/" + popupData.cta.whatsapp?.number + "?text=" + popupData.cta.whatsapp?.message;
                break;
            case POPUP_ACTIONS.EMAIL:
                popupData.cta.url = "mailto:" + popupData.cta.email?.email + "?subject=" + popupData.cta.email?.subject + "&body=" + popupData.cta.email?.message;
                break;
            default:
                break;
        }
    }

}

export interface IPopupData{
    image:string,
    title:string,
    description:string,
    time?:string,
    duration?:string,
    timeUnit?:string,
    cta?:CTA
}

export interface CTA{
    text:string,
    url:string,
    action?:string,
    whatsapp?:WhatsappMessage,
    email?:EmailMessage,
    style?:Style
}

export interface Style {
    textColor:string,
    backgroundColor:string,
}

export interface WhatsappMessage{
    number:string,
    message?:string,
}

export interface EmailMessage{
    email:string,
    message?:string,
    subject?:string
}