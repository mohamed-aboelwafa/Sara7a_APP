
import joi from "joi";
import { generalFields } from "../../Middlewares/validation.middleware.js";

export const signupSchema = {
    body: joi.object({
        username: generalFields.username.required(),

        email: generalFields.email.required(),

        password: generalFields.password.required(),

        confirmPassword: generalFields.confirmPassword,

        phone: generalFields.phone,

        gender: generalFields.gender,

        role: generalFields.role,

        provider: generalFields.provider,

        DOB: generalFields.DOB,

        confirmEmail: generalFields.confirmEmail,

        profilePic: generalFields.profilePic,

        coverPictures: generalFields.coverPictures,

        id: generalFields.id,
    })
};

export const loginSchema = {
    body: joi.object({
        email: generalFields.email.required(),

        password: generalFields.password.required(),
    })
};


export const confirmEmailSchema = {
    body: joi.object({
        email: generalFields.email.required(),
        otp: joi.string().pattern(/^\d{6}$/),
    })
};

export const forgetPasswordSchema = {
    body: joi.object({
        email: generalFields.email.required(),
    })
};

export const resetPasswordSchema = {
    body: joi.object({
        email: generalFields.email.required(),
        otp: joi.string().pattern(/^\d{6}$/),
        newPassword: generalFields.password.required(),
        confirmPassword: joi.ref("newPassword")
    })
};