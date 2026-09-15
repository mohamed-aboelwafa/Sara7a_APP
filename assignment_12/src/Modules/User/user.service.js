import { successResponse } from "../../Utils/response/success.response.js";
import * as exception from "../../Utils/response/error.response.js";

import UserModel from "../../DB/Models/user.model.js";

import {
    findByIdAndUpdate
} from "../../DB/database.repository.js";

import { decrypt } from "../../Utils/security/encryption.security.js";

import fs from "node:fs/promises";
import path from "node:path";

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