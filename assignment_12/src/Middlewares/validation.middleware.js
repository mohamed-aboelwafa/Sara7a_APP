
import joi from "joi";
import {BadRequestException} from "../Utils/response/error.response.js";
import { GenderEnum, RoleEnum, ProviderEnum } from "../Utils/enums/user.enum.js"
import { Types } from "mongoose";

export const generalFields = {
    username: joi.string().min(2).max(25).alphanum(),
    email: joi.string().email({
        // minDomainSegments:2,
        // maxDominSegments:5,
        // tdls: {allow: ["com", "net", "org"]}
    }),
    password: joi.string().alphanum(),
    confirmPassword: joi.ref("password"),
    phone: joi.string().pattern(/^(\+20|020|0)?1[0125][0-9]{8}$/).messages({
        "string.pattern.base": "Invalid Phone Number Format",
    }),
    gender: joi.number().valid(...Object.values(GenderEnum)),
    role: joi.number().valid(...Object.values(RoleEnum)),
    provider: joi.number().valid(...Object.values(ProviderEnum)),
    DOB: joi.string().isoDate(),
    confirmEmail: joi.string().isoDate(),
    profilePic: joi.string(),
    coverPictures: joi.array().items(joi.string()),
    id: joi.string().custom((value, helper) => {
        return Types.ObjectId.isValid(value)
            ? value
            : helper.message("Invalid ObjectId Format");
    }),
}



export const validation = (schema)=>{
    return (req, res, next)=>{
        const validationError = [];
        for (const key of Object.keys(schema)) {
            const validationResults = schema[key].validate(req[key], {
                abortEarly: false,
            });

            if (validationResults.error) {
                validationError.push({
                    key,
                    details: validationResults.error.details
                });
            }
        }

        if (validationError.length) {
            throw BadRequestException("Validation Error", validationError);
        }
        return next();
    }
}
