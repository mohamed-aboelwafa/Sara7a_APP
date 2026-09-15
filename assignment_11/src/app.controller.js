
import connectDB from "./DB/connection.js";
import {authRouter , userRouter , messageRouter} from "./Modules/index.js";
import { globalHandler } from "./Utils/response/error.response.js";
import { successResponse } from "./Utils/response/success.response.js";
import cors from "cors";
import path from "node:path";

const bootstrap = async (app,express)=>{
    app.use(express.json(), cors());
    await connectDB();

    // http://localhost:3000/api/v1/
    app.get("/api/v1/",(req,res)=>{
        successResponse({
            res , statusCode: 201 , message: "welcome to app.controller.js"
        });
    })

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
