import jwt from "jsonwebtoken"
import { config } from "../config/config.js";


export const DecodeToken=async (token)=>{
    try {
       
        return await jwt.verify(token,config.ACCESS_TOKEN_SECRET)
    }
    catch (e) {
        return null
    }
}