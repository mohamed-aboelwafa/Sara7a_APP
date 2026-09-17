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
import { validation } from "../../Middlewares/validation.middleware.js";

import * as userValidation from "./user.validation.js";

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

// localhost:3000/api/v1/user/update-password
router.patch(
    "/update-password",
    authentication({
        tokenType: TokenTypeEnum.ACCESS
    }),
    authorization({
        accessRoles: [RoleEnum.ADMIN]
    }),
    validation(userValidation.updatePasswordSchema),
    UserService.updatePassword
);

// localhost:3000/api/v1/user/freeze-account
router.patch(
    "{/:userId}/freeze-account",
    authentication({
        tokenType: TokenTypeEnum.ACCESS
    }),
    authorization({
        accessRoles: [RoleEnum.ADMIN, RoleEnum.USER]
    }),
    validation(userValidation.freezeSchema),
    UserService.freezeAccount
);

// localhost:3000/api/v1/user/restore-account
router.patch(
    "{/:userId}/restore-account",
    authentication({
        tokenType: TokenTypeEnum.ACCESS
    }),
    authorization({
        accessRoles: [RoleEnum.ADMIN, RoleEnum.USER]
    }),
    validation(userValidation.restoreSchema),
    UserService.restoreAccount
);

// localhost:3000/api/v1/user/:wanted_user_id/hard-delete-account
router.delete(
    "/:wanted_user_id/hard-delete-account",
    authentication({
        tokenType: TokenTypeEnum.ACCESS
    }),
    authorization({
        accessRoles: [RoleEnum.ADMIN]
    }),
    validation(userValidation.hardDeleteSchema),
    UserService.hardDelete
);


export default router;