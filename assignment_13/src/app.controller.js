
import connectDB from "./DB/connection.js";
import {authRouter , userRouter , messageRouter} from "./Modules/index.js";
import { globalHandler } from "./Utils/response/error.response.js";
import { successResponse } from "./Utils/response/success.response.js";
import cors from "cors";
import path from "node:path";
import { sendEmail } from "./Utils/email/email.utils.js";
import { corsOptions } from "./Utils/cors/cors.utils.js";
import helmet from "helmet";
import morgan from "morgan";
import { attachRouterLogger } from "./Utils/loggers/morgan.logger.js";
import {rateLimit} from "express-rate-limit";


const limiter = rateLimit({
    windowMs: 2*60*1000, // 2 min
    limit: 3, // number of req
    handler: (req,res)=>{
        return res.status(429).json({message: "too many requests please try again later"});
    },
    legacyHeaders: false,
})

const bootstrap = async (app,express)=>{
    app.use(express.json(), cors(corsOptions()), helmet(), morgan("combined"), limiter);
    await connectDB();

    // http://localhost:3000/api/v1/
    app.get("/api/v1/",(req,res)=>{
        successResponse({
            res , statusCode: 201 , message: "welcome to app.controller.js"
        });
    })

    // here (to) is the receiver email
    await sendEmail({to:"mohamedabuelwafa1111@gmail.com", text:"this is 1st send mail", subject:"welcome message"});
    

    attachRouterLogger(app, "/api/v1/auth", authRouter, "access.log");

    // http://localhost:3000/api/v1/auth
    app.use("/api/v1/auth" , authRouter);
    // http://localhost:3000/api/v1/user
    app.use("/api/v1/user" , userRouter);
    // http://localhost:3000/api/v1/message
    app.use("/api/v1/message" , messageRouter);
    // http://localhost:3000/api/v1/uploads
    app.use("/uploads", express.static(path.resolve("./src/uploads")));
    app.use(globalHandler);
}

export default bootstrap;
