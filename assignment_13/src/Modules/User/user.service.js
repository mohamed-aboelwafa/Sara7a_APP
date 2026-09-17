import { successResponse } from "../../Utils/response/success.response.js";
import * as exception from "../../Utils/response/error.response.js";

import UserModel from "../../DB/Models/user.model.js";

import {
    deleteOne,
    findById,
    findByIdAndUpdate,
    findOne,
    updateOne
} from "../../DB/database.repository.js";

import { decrypt } from "../../Utils/security/encryption.security.js";

import fs from "node:fs/promises";
import path from "node:path";
import { compareHash, generateHash } from "../../Utils/security/hash.security.js";
import { HashEnum } from "../../Utils/enums/security.enum.js";
import { RoleEnum } from "../../Utils/enums/user.enum.js";

export const welcome = async (req, res) => {
    successResponse({
        res,
        message: "welcome from user.service.js",
        statusCode: 200,
        data: {}
    });
};

export const getProfile = async (req, res) => {

    const { existing_user } = req;

    if (existing_user.phone) {
        existing_user.phone = decrypt(existing_user.phone);
    }

    successResponse({
        res,
        statusCode: 200,
        data: { existing_user }
    });
};


// Upload Profile Picture
// Old profile picture -> profilePictures (Gallery)
// New picture -> profilePic

export const uploadProfilePic = async (req, res) => {

    if (!req.file) {
        throw exception.BadRequestException(
            "Profile picture is required"
        );
    }

    const existing_user = req.existing_user;

    const update = {
        profilePic: req.file.finalPath
    };

    // Move old profile picture to gallery
    if (existing_user.profilePic) {

        update.$push = {
            profilePictures: existing_user.profilePic
        };
    }

    const updated_user = await UserModel.findByIdAndUpdate(
        existing_user._id,
        update,
        {
            new: true,
            runValidators: true
        }
    );

    successResponse({
        res,
        statusCode: 200,
        data: { updated_user },
        message: "profile picture updated successfully"
    });
};


// Remove Profile Picture
// Delete image from Hard Disk
// Remove image path from Database

export const removeProfilePic = async (req, res) => {

    const existing_user = req.existing_user;

    if (!existing_user.profilePic) {
        throw exception.NotFoundException(
            "Profile picture not found"
        );
    }

    const filePath = path.resolve(
        "./src",
        existing_user.profilePic
    );

    try {

        await fs.unlink(filePath);

    } catch (error) {

        if (error.code !== "ENOENT") {
            throw error;
        }
    }

    const updated_user = await UserModel.findByIdAndUpdate(
        existing_user._id,
        {
            $unset: {
                profilePic: 1
            }
        },
        {
            new: true
        }
    );

    successResponse({
        res,
        statusCode: 200,
        data: { updated_user },
        message: "profile picture removed successfully"
    });
};


// Upload Cover Pictures
// Existing pictures + New pictures = 2

export const uploadCoverPic = async (req, res) => {

    if (!req.files || req.files.length === 0) {
        throw exception.BadRequestException(
            "At least one cover picture is required"
        );
    }

    const existing_user = req.existing_user;

    const existingPictures =
        existing_user.coverPictures || [];

    const newPictures = req.files.map(
        (file) => file.finalPath
    );

    const totalPictures =
        existingPictures.length + newPictures.length;

    // Total cover pictures MUST equal 2
    if (totalPictures !== 2) {

        // Delete newly uploaded files
        for (const file of req.files) {

            try {

                await fs.unlink(file.path);

            } catch (error) {

                // Ignore if file doesn't exist

            }
        }

        throw exception.BadRequestException(
            `You must have exactly 2 cover pictures. Current total: ${totalPictures}`
        );
    }

    const updated_user =
        await UserModel.findByIdAndUpdate(
            existing_user._id,
            {
                coverPictures: [
                    ...existingPictures,
                    ...newPictures
                ]
            },
            {
                new: true,
                runValidators: true
            }
        );

    successResponse({
        res,
        statusCode: 200,
        data: { updated_user },
        message: "cover pictures uploaded successfully"
    });
};


// Visit Profile
// Increase profile visit count by 1

export const visitProfile = async (req, res) => {

    const { id } = req.params;

    const user =
        await UserModel.findByIdAndUpdate(
            id,
            {
                $inc: {
                    profileVisitCount: 1
                }
            },
            {
                new: true
            }
        );

    if (!user) {
        throw exception.NotFoundException(
            "User Not Found"
        );
    }

    successResponse({
        res,
        statusCode: 200,
        message: "Profile visited successfully"
    });
};


// Admin Only
// Get Profile Visit Count

export const getProfileVisitCount = async (req, res) => {

    const { id } = req.params;

    const user = await UserModel
        .findById(id)
        .select("profileVisitCount");

    if (!user) {
        throw exception.NotFoundException(
            "User Not Found"
        );
    }

    successResponse({
        res,
        statusCode: 200,
        data: {
            profileVisitCount:
                user.profileVisitCount
        }
    });
};


// Update Password

export const updatePassword = async (req, res) => {
    // user send oldPassword & newPassword & confirmNewPassword
    const {oldPassword, newPassword, confirmNewPassword} = req.body;

    // compare [oldPassword (req.body)] with [user password (in my DB)]
    const isValidOldPassword = await compareHash({
        plaintext: oldPassword,
        ciphertext: req.existing_user.password,
        algorithm: HashEnum.Argon2
    });
    if(!isValidOldPassword) return exception.BadRequestException("Invalid Cridentials");

    // hashing newPassword (req.body)
    const hashedNewPassword = await generateHash({
        plaintext: newPassword,
        algorithm: HashEnum.Argon2,
    });

    // update user password with hashedNewPassword
    await updateOne({
        model: UserModel,
        filter: {_id: req.existing_user._id},
        update: {password: hashedNewPassword}
    });

    successResponse({
        res,
        message: "Password Updated Successfully"
    })
}

// Freeze Account

export const freezeAccount = async (req, res) => {

    // receive userId from req.params
    const {userId} = req.params;

    // targetUserId maybe userId (req.params) || req.existing_user._id
    const targetUserId = userId || req.existing_user._id;

    // only ADMIN role can freeze another accounts
    if(req.existing_user.role !== RoleEnum.ADMIN && targetUserId.toString() !== req.existing_user._id.toString()){
        return exception.ForbiddenException("you are not authorized to freeze this account");
    }

    
    // check if targetUserId exists
    const wanted_user = await findOne({
        model: UserModel,
        filter: { _id: targetUserId }
    });

    // check if this wanted account to freeze exists in DB
    if (!wanted_user) {
        return exception.NotFoundException("User Not Found");
    }
    // check if this account is not already freezed
    if (wanted_user.freezedAt) {
        return exception.BadRequestException("Account Already Freezed");
    }
    
    // if this Id exists updated this account
    await findByIdAndUpdate({
        model: UserModel,
        id: targetUserId,
        update: {
            freezedBy: req.existing_user._id,
            freezedByRole: req.existing_user.role,
            freezedAt: new Date(),
            $unset: {
                restoredBy: true,
                restoredAt: true
            }
        }
    });

    return successResponse({
        res,
        message: "Account Freezed Successfully"
    })
}


// Restor Account

export const restoreAccount = async (req, res) => {

    // receive userId from req.params
    const {userId} = req.params;

    // targetUserId maybe userId (req.params) || req.existing_user._id
    const targetUserId = userId || req.existing_user._id;

    // check if wanted user to restore exists or not in DB 
    // check if wanted user to restore has freezedAt or not
    const wanted_user = await findById({
        model: UserModel,
        id: targetUserId
    });
    if(!wanted_user || !wanted_user.freezedAt){
        return exception.NotFoundException("wanted user to restore is not found or it is not aready frozen");
    }

    if(wanted_user.freezedByRole == RoleEnum.ADMIN && req.existing_user.role !== RoleEnum.ADMIN){
        return exception.ForbiddenException("only admin role can restore this account");
    }

    if(req.existing_user.role !== RoleEnum.ADMIN && targetUserId.toString() !== req.existing_user._id.toString()){
        return exception.ForbiddenException("you are not authorized to freeze this account");
    }

    // update wanted user to restore
    await updateOne({
        model: UserModel,
        filter:{_id: targetUserId},
        update: {
            restoredAt: new Date(),
            restoredBy: req.existing_user._id,
            restoredByRole: req.existing_user.role,
            $unset: {
                freezedAt: true,
                freezedBy: true,
                freezedByRole: true
            }
        }
    })
    
    return successResponse({
        res,
        message: "Account Restored Successfully",
        statusCode: 200,
        data: {}
    })
}

// Hard Delete
export const hardDelete = async (req, res) => {

    // user send (wanted_user_id) in req.params
    const {wanted_user_id} = req.params;

    console.log("wanted_user_id:", wanted_user_id);

    // check if (wanted_user_id) exists in DB
    // delete account of (wanted_user) from DB
    const results = await deleteOne({
        model: UserModel,
        filter: {_id: wanted_user_id}
    });
    if(!results.deletedCount){
        return exception.NotFoundException("user not found");
    }

    return successResponse({
        res,
        message: "Account Deleted Successfully",
        statusCode: 200
    });
}