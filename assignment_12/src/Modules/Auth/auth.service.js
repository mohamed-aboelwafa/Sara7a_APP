
import * as config from "../../config/config.service.js";
import { CLIENT_ID } from "../../config/config.service.js";

import UserModel from "../../DB/Models/user.model.js";
import TokenModel from "../../DB/Models/token.model.js";

import { create, find, findOne, updateOne } from "../../DB/database.repository.js";

import { successResponse } from "../../Utils/response/success.response.js"
import * as exception from "../../Utils/response/error.response.js";

import { HashEnum } from "../../Utils/enums/security.enum.js";
import { ProviderEnum } from "../../Utils/enums/user.enum.js";
import { logoutTypeEnum } from "../../Utils/enums/user.enum.js";

import {generateHash , compareHash} from "../../Utils/security/hash.security.js";
import { encrypt , decrypt} from "../../Utils/security/encryption.security.js";

import { CreateTwoTokens, CreateNewAccessToken } from "../../Utils/tokens/token.js";

import { OAuth2Client } from "google-auth-library";




export const welcome = async(req,res)=>{
    successResponse({
        res , statusCode: 201 , message: "welcome"
    });
}

export const signup = async(req,res)=>{
    // receive (username , email , password , phone , role) from req.body:
    const {username, email, password, phone, role} = req.body;

    // check if inputed user exists:
    if(await findOne({model: UserModel, filter: {email} })){
        exception.ConflictException("user already exists");
    }
        
    // hashing password:
    const hashedPassword = await generateHash({plaintext: password, algorithm: HashEnum.Argon2});

    // encrypt phone:
    const encryptedPhone = encrypt(phone);

    // creating new user:
    const new_user = await create({
        model: UserModel,
        data: [
            {username, email, password: hashedPassword, phone:encryptedPhone, role}
        ],
    });

    successResponse({
        res , statusCode: 201 , message: "user created successfully" , data:{new_user}
    });
}

export const login = async(req,res)=>{
    // receive email and password from req.body:
    const {email, password} = req.body;

    // check if user email exists:
    const existing_user = await findOne({model: UserModel, filter: {email} });
    if(!existing_user) return exception.BadRequestException("user not found");

    // compare password:
    const matchPassword = await compareHash({
        plaintext: password, // (data) came from req.body
        ciphertext: existing_user.password, // (hashed value) came from existing_user 
        algorithm: HashEnum.Argon2,
    });
    if(!matchPassword) return exception.UnauthorizedException("invalid credentials");

    // creating tokens:
    const tokens = await CreateTwoTokens(existing_user);

    return successResponse({
        res , statusCode: 201 , message: "user logged in successfully" , data: { tokens },
    });
}

export const GetNewAccessToken = async(req,res)=>{
    const new_access_token = await CreateNewAccessToken(req.existing_user);

    return successResponse({
        res , statusCode: 200 , message: "Done" , data: { new_access_token },
    });
}

async function verifyGoogleAccount({idToken}){
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken,
        audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
}

export const loginWithGoogle = async (req, res) => {

    // receive idToken from req.body
    const { idToken } = req.body;

    // get payload from idToken
    const {
        email,
        email_verified,
        given_name,
        family_name,
        picture
    } = await verifyGoogleAccount({ idToken });

    // check email verification
    if (!email_verified) {
        return exception.BadRequestException("Email Not Verified");
    }

    // check if email exists in DB
    const existing_user = await findOne({
        model: UserModel,
        filter: { email }
    });

    // user already exists
    if (existing_user) {

        // Google user → login
        if (existing_user.provider === ProviderEnum.Google) {

            const credentials = await CreateTwoTokens(existing_user);

            return successResponse({
                res,
                statusCode: 200,
                message: "login successfully",
                data: { credentials }
            });
        }

        // email belongs to normal system account
        return exception.ConflictException(
            "Email already exists with another provider"
        );
    }

    // user doesn't exist → create Google account
    const new_user = await create({
        model: UserModel,
        data: [{
            firstName: given_name || "Google",
            lastName: family_name || "User",
            email,
            profilePic: picture,
            provider: ProviderEnum.Google
        }]
    });

    // create tokens
    const credentials = await CreateTwoTokens(new_user);

    return successResponse({
        res,
        statusCode: 201,
        message: "Google account created successfully",
        data: { credentials }
    });
};

export const logout = async(req,res)=>{
    // create a document in (token model) , this document contains jti for this jwt
    const {flag} = req.body;
    let status = 200;
    switch(flag){
        case logoutTypeEnum.logout:
            await create({
                model: TokenModel,
                data:[
                    {
                        jti: req.decodedToken.jti,
                        userId: req.existing_user._id,
                        expiresIn: new Date(req.decodedToken.exp * 1000),
                    }
                ]
            })
            status = 201
            break;
        case logoutTypeEnum.logoutFromAll:
            await updateOne({model: UserModel, filter: {_id: req.existing_user._id}, update:{changeCredentilasTime: Date.now()}})
            status = 200
            break;
    }

    return successResponse({
        res,
        message: "logout successfully",
        statusCode: status,
    })
}
