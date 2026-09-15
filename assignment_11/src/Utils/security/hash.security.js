
import * as exception from "../../Utils/response/error.response.js";

import {hash, compare} from "bcrypt";
import * as argon2 from "argon2";
import { SALT_ROUND } from "../../config/config.service.js";
import { HashEnum } from "../enums/security.enum.js";


export const generateHash = async({
    plaintext,
    saltRounds = Number(SALT_ROUND),
    algorithm = HashEnum.Bcrypt,
})=>{
    let hashResult = "";
    switch(algorithm){
        case HashEnum.Bcrypt:
            hashResult = await hash(plaintext,saltRounds);
            break;
        case HashEnum.Argon2:
            hashResult = await argon2.hash(plaintext);
            break;
        default:
            exception.InternalServerErrorException("unsupported hashing algorithm");
    }
    return hashResult;
};


export const compareHash = async({
    plaintext,
    ciphertext,
    algorithm = HashEnum.Bcrypt,
})=>{
    let match = false;
    switch(algorithm){
        case HashEnum.Bcrypt:
            match = await compare(plaintext,ciphertext);
            break;
        case HashEnum.Argon2:
            match = await argon2.verify(ciphertext,plaintext);
            break;
        default:
            exception.InternalServerErrorException("unsupported hashing algorithm");
    }
    return match;
};

