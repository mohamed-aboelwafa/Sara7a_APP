
import multer from "multer";
import path from "node:path";
import fs from "node:fs";

export const fileValidation = {
    images: ["image/png" , "image/jpeg"],
    videos: ["video/mp4"],
    audios: ["audio/mp3"],
    documents: ["application/pdf"]
}

export const localFileUpload=({customPath="general" , validation = []})=>{

    const basePath = `uploads/${customPath}`; // uploads/users
    const storage = multer.diskStorage({
        destination: (req, file, cb)=>{
            let userBasePath = basePath; // uploads/users
            if(req.existing_user?._id) userBasePath += `/${req.existing_user._id}`; // uploads/users/existing_user._id
            const fullPath = path.resolve(`./src/${userBasePath}`); // c://.../src/uploads/users/existing_user._id

            if(!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, {recursive: true});
            cb(null, path.resolve(fullPath));
        },
        filename: (req, file, cb)=>{
            const uniqueFilename = Date.now() + "-" + Math.random() + "- " + file.originalname;

            file.finalPath = `${basePath}/${req.existing_user._id}/${uniqueFilename}`;
            cb(null, uniqueFilename)
        }
    });

    const fileFilter = (req,file,cb)=>{
        if(validation.includes(file.mimetype)){
            cb(null, true);
        }else{
            return cb(new Error("invalid file type") , false);
        }
    };

    return multer({fileFilter, storage});
}