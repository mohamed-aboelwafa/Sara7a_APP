
import nodemailer from "nodemailer";
import { USER_EMAIL, USER_PASS } from "../../config/config.service.js";

export async function sendEmail({to, subject, text, html, cc, bcc, attatchments}){
    // 1. create the transporter:
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: USER_EMAIL, // sender
            pass: USER_PASS // temp password created by google
        },
    })

    // 2. content of the message:
    try{
        const info = await transporter.sendMail({
            from: `"MOhAmeD Aboelwafa" <${USER_EMAIL}>,`, // sender name and email
            to, // receiver
            subject,
            text,
            html,
            cc,
            bcc,
            attatchments,
        })
        console.log(`Email sent: ${info.messageId}`);
    } catch(error){
        console.log(`error while sending Email: ${error}`);
    }
}


export const emailSubject = {
    confirmEmail: "Confirm Your Email",
    resetPassword: "Reset Your Password",
    welcome: "Welcome To Saraha App",
    contactUs: "Contact Us",
}
