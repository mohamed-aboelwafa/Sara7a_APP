import {Router} from "express";
import * as messageService from "./message.service.js";

const router = Router();


// localhost:3000/api/v1/message/welcome
router.get("/welcome" , messageService.welcome);

export default router;

