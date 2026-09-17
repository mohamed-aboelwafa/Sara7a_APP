import {EventEmitter} from "node:events";
import { emailSubject, sendEmail } from "./email.utils.js";
import { generateHtml } from "./generateHTML.js";

export const emailEvents = new EventEmitter();

emailEvents.on("confirmEmail", async(data)=>{
    try{
        await sendEmail({to:data.to, subject:emailSubject.confirmEmail, html: generateHtml(data.otp)})
    } catch(error){
        console.log("error in sending email", error)
    }
})


emailEvents.on("forgetPassword", async(data)=>{
    try{
        await sendEmail({
            to:data.to,
            subject:emailSubject.resetPassword,
            html: generateHtml(data.otp)
        })
    } catch(error){
        console.log("error in sending email", error)
    }
})