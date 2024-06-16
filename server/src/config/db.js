import mongoose from "mongoose";
import { config } from "./config.js";


const connectDB = async ()=>{
   try {
    
    mongoose.connection.on("connected",()=>{
     console.log(`mongodb connected successfully`);
    })
    mongoose.connection.on("error",(err)=>{
     console.log(`error in connecting to db ${err}`);
    })

    //MONGODB_URI_STRING connection

    await mongoose.connect(config.MONGODB_URI_STRING)

    //LOCALHOST DB
    
   //  await mongoose.connect(config.MONGODB_LOCAL_STRING)


   } catch (error) {
    console.err(`Failed to connect to db ${err}`);
    process.exit(1)
   }
}

export default connectDB