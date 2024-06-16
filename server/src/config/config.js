import { config as conf } from "dotenv"
conf()
const _config = {
    port : process.env.PORT,
    MONGODB_LOCAL_STRING : process.env.MONGODB_LOCAL_STRING,
    MONGODB_URI_STRING : process.env.MONGODB_URI_STRING,

    CORS_ORIGIN : process.env.CORS_ORIGIN,
    FRONTEND_URL : process.env.FRONTEND_URL,


    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY:process.env.ACCESS_TOKEN_EXPIRY,

    SMTP_HOST:process.env.SMTP_HOST,
    SMTP_PORT:process.env.SMTP_PORT,
    SMTP_USERNAME:process.env.SMTP_USERNAME,
    SMTP_PASSWORD:process.env.SMTP_PASSWORD,
    
    CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET,
}

export const config = Object.freeze(_config)