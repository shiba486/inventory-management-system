import User from "../models/user.model.js"
import {DecodeToken} from "./../utils/TokenHelper.js"
import { ErrorHandler } from "./errorMiddleware.js"


export const protect= async(req,res,next)=>{
    let token = req.headers["accessToken"]
    if(!token){
        
        token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ","")
       
    }
    let decodeToken = await DecodeToken(token)
    if(decodeToken==null){
        res.status(200).json({
            status: "fail",
            message: "unauthorised"
        })
    }


       

        const user = await User.findById({_id: decodeToken["_id"]})

        if(!user){
            throw new ErrorHandler(400,"token is invalid")
        }

        req.user = user
        



    //    req.headers["email"]=email
    //    req.headers["user_id"]=user_id
       next()
    }
