import express from "express";
const app = express()
import { config } from "./src/config/config.js";

//security libray require
import cors from "cors"
import helmet from "helmet"
import hpp from "hpp"
import cookieParser from "cookie-parser"
import mongoSanitize from "express-mongo-sanitize";
import { rateLimit } from 'express-rate-limit'

// CORS INITIAL
app.use(cors(
    {
        origin: config.CORS_ORIGIN,
        credentials: true,
        methods:["get","post","put","patch"]
    }
));

// SECURITY IMPLEMENTATION 
app.use(helmet());
app.use(hpp());
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true, limit: "50mb"}));
app.use(cookieParser());

const limiter = rateLimit({windowMs: 15 * 60 * 1000, limit: 100})
app.use(limiter)
app.use(mongoSanitize());


//userRouter import
import {userRouter} from "./src/routes/user.route.js"
import { errorMiddleware } from "./src/middlewares/errorMiddleware.js";

app.use("/api/v1/user",userRouter)

//home route
app.get("/",(req,res)=>{
    res.json({
        message: "welcome  to this web api..."
    })
})


//default route
app.get("*",(req,res)=>{
    res.json({
        message: "route not found"
    })
})

app.use(errorMiddleware)








export {app}