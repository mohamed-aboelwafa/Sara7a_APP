
import {USER_ACCESS_TOKEN_SECRET,USER_REFRESH_TOKEN_SECRET,USER_ACCESS_TOKEN_EXPIRES_IN,USER_REFRESH_TOKEN_EXPIRES_IN} from "../../config/config.service.js";
import {ADMIN_ACCESS_TOKEN_SECRET,ADMIN_REFRESH_TOKEN_SECRET,ADMIN_ACCESS_TOKEN_EXPIRES_IN,ADMIN_REFRESH_TOKEN_EXPIRES_IN} from "../../config/config.service.js";
import { RoleEnum , signatureEnum } from "../enums/user.enum.js";
import jwt from "jsonwebtoken";
import {v4 as uuidv4} from 'uuid';

export const generateToken = ({
    payload, 
    secretkey, 
    options
})=>{
    return jwt.sign(payload, secretkey, options)
}

export const verifyToken = ({
    token,
    secretKey
})=>{
    return jwt.verify(token,secretKey);
}

export const getSignature = ({signatureLevel = signatureEnum.USER}) =>{
    let signature = {accessSignature:undefined, refreshSignature:undefined, accessExpiresIn:undefined , refreshExpiresIn:undefined};

    switch(signatureLevel){
        case signatureEnum.ADMIN:
            signature.accessSignature = ADMIN_ACCESS_TOKEN_SECRET;
            signature.refreshSignature = ADMIN_REFRESH_TOKEN_SECRET;
            signature.accessExpiresIn = ADMIN_ACCESS_TOKEN_EXPIRES_IN;
            signature.refreshExpiresIn = ADMIN_REFRESH_TOKEN_EXPIRES_IN;
            break;
        case signatureEnum.USER:
            signature.accessSignature = USER_ACCESS_TOKEN_SECRET;
            signature.refreshSignature = USER_REFRESH_TOKEN_SECRET;
            signature.accessExpiresIn = USER_ACCESS_TOKEN_EXPIRES_IN;
            signature.refreshExpiresIn = USER_REFRESH_TOKEN_EXPIRES_IN;
            break;
        default:
            signature.accessSignature = USER_ACCESS_TOKEN_SECRET;
            signature.refreshSignature = USER_REFRESH_TOKEN_SECRET;
            signature.accessExpiresIn = USER_ACCESS_TOKEN_EXPIRES_IN;
            signature.refreshExpiresIn = USER_REFRESH_TOKEN_EXPIRES_IN;
            break;
    }

    return signature;
}

export const CreateTwoTokens = async(existing_user) =>{

    const signature = await getSignature({signatureLevel: existing_user.role === RoleEnum.ADMIN? signatureEnum.ADMIN : signatureEnum.USER})
    const jwtid = uuidv4();
    
    // create acesss_token:
    const access_token = generateToken({
        payload: {id: existing_user._id},
        secretkey: signature.accessSignature,
        options: {
            expiresIn: signature.accessExpiresIn,
            jwtid
        }
    });

    // create refresh_token:
    const refresh_token = generateToken({
        payload: {id: existing_user._id},
        secretkey: signature.refreshSignature,
        options: {
            expiresIn: signature.refreshExpiresIn,
            jwtid
        }
    });
    return {access_token , refresh_token};
}

export const CreateNewAccessToken = async(existing_user) =>{

    const signature = await getSignature({signatureLevel: existing_user.role === RoleEnum.ADMIN? signatureEnum.ADMIN : signatureEnum.USER})

    // create acesss_token:
    const new_access_token = generateToken({
        payload: {id: existing_user._id},
        secretkey: signature.accessSignature,
        options: {
            expiresIn: signature.accessExpiresIn,
            jwtid: uuidv4()
        }
    });

    return new_access_token;
}