
import crypto from 'node:crypto';
import {ENC_KEY} from "../../config/config.service.js";




const ENCRYPTION_SECRET_KEY = Buffer.from(ENC_KEY);
const IV_LENGTH = 16;

export const encrypt = (text)=>{
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipheriv("aes-256-cbc",ENCRYPTION_SECRET_KEY,iv);

    let encryptedData = cipher.update(text,"utf-8","hex");

    encryptedData += cipher.final("hex");

    return `${iv.toString("hex")}:${encryptedData}`;
}

export const decrypt = (encryptedData)=>{
    
    const [ivhexa , encryptedText] = encryptedData.split(":");

    const binaryLikeIv = Buffer.from(ivhexa,"hex");

    const decipher = crypto.createDecipheriv("aes-256-cbc",ENCRYPTION_SECRET_KEY,binaryLikeIv);

    let decryptedData = decipher.update(encryptedText,"hex","utf-8");

    decryptedData += decipher.final("utf-8");

    return decryptedData;
}