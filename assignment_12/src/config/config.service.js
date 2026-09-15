
import dotenv from "dotenv";
import { resolve } from "node:path";

const envPath = {
    development: "dev.env",
    production: "prod.env",
};

dotenv.config( {path: resolve(`./src/config/${envPath.development}`) });



export const NODE_ENV = process.env.NODE_ENV || "development";


export const PORT = process.env.PORT || 5000;
export const CLOUD_URI = process.env.CLOUD_URI;
export const LOCAL_URI = process.env.LOCAL_URI;


export const SALT_ROUND = process.env.SALT_ROUND || 10;
export const ENC_KEY = process.env.ENC_KEY;

// tokens
export const USER_ACCESS_TOKEN_SECRET = process.env.USER_ACCESS_TOKEN_SECRET
export const USER_ACCESS_TOKEN_EXPIRES_IN = process.env.USER_ACCESS_TOKEN_EXPIRES_IN
export const USER_REFRESH_TOKEN_SECRET = process.env.USER_REFRESH_TOKEN_SECRET
export const USER_REFRESH_TOKEN_EXPIRES_IN = process.env.USER_REFRESH_TOKEN_EXPIRES_IN

export const ADMIN_ACCESS_TOKEN_SECRET = process.env.ADMIN_ACCESS_TOKEN_SECRET
export const ADMIN_ACCESS_TOKEN_EXPIRES_IN = process.env.ADMIN_ACCESS_TOKEN_EXPIRES_IN
export const ADMIN_REFRESH_TOKEN_SECRET = process.env.ADMIN_REFRESH_TOKEN_SECRET
export const ADMIN_REFRESH_TOKEN_EXPIRES_IN = process.env.ADMIN_REFRESH_TOKEN_EXPIRES_IN


export const CLIENT_ID = process.env.CLIENT_ID;

