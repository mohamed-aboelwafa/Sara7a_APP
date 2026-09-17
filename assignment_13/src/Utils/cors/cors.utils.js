import { WHITE_LIST } from "../../config/config.service.js"
import { BadRequestException, NotFoundException } from "../response/error.response.js";

export function corsOptions() {
    const whiteList = WHITE_LIST.split(",");
    
    const coreOptions = {
        origin: function(origin,callback){
            if(whiteList.includes(origin)){
                callback(null, true);
            } else if(!origin){
                callback(null, true)
            } else{
                callback(BadRequestException("Not Allowed By CORS"));
            }
        },
        methods: ["GET", "POST", "PATCH"] // specify allowed methods
    };

    return coreOptions;
}