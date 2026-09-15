import { Router } from "express";

import * as UserService from "./user.service.js";

import {
    authentication,
    authorization
} from "../../Middlewares/authentication.middleware.js";

import {
    TokenTypeEnum,
    RoleEnum
} from "../../Utils/enums/user.enum.js";

import { localFileUpload } from "../../Utils/multer/local.multer.js";
import { fileValidation } from "../../Utils/multer/local.multer.js";

const router = Router();

// localhost:3000/api/v1/user/welcome
router.get(
    "/welcome",
    UserService.welcome
);

// localhost:3000/api/v1/user/get-profile
router.get(
    "/get-profile",
    authentication({
        tokenType: TokenTypeEnum.ACCESS
    }),
    authorization({
        accessRoles: [
            RoleEnum.USER,
            RoleEnum.ADMIN
        ]
    }),
    UserService.getProfile
);

// localhost:3000/api/v1/user/upload-profile-picture
router.patch(
    "/upload-profile-picture",
    authentication({
        tokenType: TokenTypeEnum.ACCESS
    }),
    authorization({
        accessRoles: [
            RoleEnum.USER,
            RoleEnum.ADMIN
        ]
    }),
    localFileUpload({
        customPath: "users",
        validation: [...fileValidation.images]
    }).single("attachments"),
    UserService.uploadProfilePic
);

// localhost:3000/api/v1/user/upload-cover-pictures
router.patch(
    "/upload-cover-pictures",
    authentication({
        tokenType: TokenTypeEnum.ACCESS
    }),
    authorization({
        accessRoles: [
            RoleEnum.USER,
            RoleEnum.ADMIN
        ]
    }),
    localFileUpload({
        customPath: "users",
        validation: [...fileValidation.images]
    }).array("attachments", 2),
    UserService.uploadCoverPic
);

// localhost:3000/api/v1/user/remove-profile-picture
router.delete(
    "/remove-profile-picture",
    authentication({
        tokenType: TokenTypeEnum.ACCESS
    }),
    authorization({
        accessRoles: [
            RoleEnum.USER,
            RoleEnum.ADMIN
        ]
    }),
    UserService.removeProfilePic
);

// localhost:3000/api/v1/user/visit-profile/:id
router.get(
    "/visit-profile/:id",
    authentication({
        tokenType: TokenTypeEnum.ACCESS
    }),
    UserService.visitProfile
);

// localhost:3000/api/v1/user/profile-visit-count/:id
router.get(
    "/profile-visit-count/:id",
    authentication({
        tokenType: TokenTypeEnum.ACCESS
    }),
    authorization({
        accessRoles: [RoleEnum.ADMIN]
    }),
    UserService.getProfileVisitCount
);

export default router;