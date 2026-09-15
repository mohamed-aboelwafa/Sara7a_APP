import {Router} from "express";
import * as authService from "./auth.service.js";
import {RoleEnum , TokenTypeEnum} from ".././../Utils/enums/user.enum.js";
import { authentication } from "../../Middlewares/authentication.middleware.js";
import * as authValidation from "./auth.validation.js";
import { validation } from "../../Middlewares/validation.middleware.js";

const router = Router();

// localhost:3000/api/v1/auth/welcome
router.get("/welcome", authService.welcome);

// localhost:3000/api/v1/auth/signup
router.post("/signup", validation(authValidation.signupSchema), authService.signup);

// localhost:3000/api/v1/auth/login
router.post("/login", validation(authValidation.loginSchema), authService.login);

// localhost:3000/api/v1/auth/get-new-access-token
router.get("/get-new-access-token", authentication({tokenType:TokenTypeEnum.REFRESH}), authService.GetNewAccessToken);

// localhost:4200 // to login with google using front-end & get idToken from front-end
// http://localhost:3000/api/v1/auth/social-login
router.post("/social-login", authService.loginWithGoogle);

// http://localhost:3000/api/v1/auth/logout
router.post("/logout", authentication({tokenType: TokenTypeEnum.ACCESS}), authService.logout);


export default router;
