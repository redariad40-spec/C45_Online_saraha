
import dotenv from 'dotenv'
import path from "path"
export const NODE_ENV=process.env.NODE_ENV||'dev';

const envpath={
  prod:path.resolve('./config/.env.prod') ,
  dev:path.resolve('./config/.env.dev') 
}
    dotenv.config({path:envpath[NODE_ENV]})

export const SERVER_PORT= process.env.PORT ||3000

export const GOOGLE_CLIENT_ID=process.env.GOOGLE_CLIENT_ID



export const DB_URL_LOCAL= process.env.DB_URL_LOCAL||"";
export const DB_URL_ATLAS= process.env.DB_URL_ATLAS||"";

export const SALT_ROUND=parseInt (process.env.SALT_ROUND)||10;
export const ENCRYPTION_KEY=process.env.ENCRYPTION_KEY;
export const TOKEN_SIGNATURE_User_ACCESS =process.env.TOKEN_SIGNATURE_User_ACCESS;
export const TOKEN_SIGNATURE_Admin_ACCESS =process.env.TOKEN_SIGNATURE_Admin_ACCESS;
export const TOKEN_SIGNATURE_User_REFRESH =process.env.TOKEN_SIGNATURE_User_REFRESH;
export const TOKEN_SIGNATURE_Admin_REFRESH =process.env.TOKEN_SIGNATURE_Admin_REFRESH;
export const REDIS_URL= process.env.REDIS_URL || "";


export const MAIL_PASS=process.env.MAIL_PASS
export const MAIL_USER=process.env.MAIL_USER