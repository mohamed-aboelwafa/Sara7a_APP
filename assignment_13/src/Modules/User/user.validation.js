
import joi from "joi";
import { generalFields } from "../../Middlewares/validation.middleware.js";

export const updatePasswordSchema = {
    body: joi.object({
        oldPassword: generalFields.password.required(),
        newPassword:generalFields.password.required(),
        confirmNewPassword: joi.ref("newPassword"),
    })
};

export const freezeSchema = {
    params: joi.object({
        // must be _id
        userId: joi.string().custom((value , helper)=>{
            return (Types.ObjectId.isValid(value) || helper.message("invalid ObjectId format"))
        })
    })
};

export const restoreSchema = {
    params: joi.object({
        userId: generalFields.id
    })
};

export const hardDeleteSchema = {
    params: joi.object({
        wanted_user_id: generalFields.id.required()
    })
};