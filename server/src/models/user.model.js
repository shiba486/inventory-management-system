import  mongoose from 'mongoose';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { config } from '../config/config.js';


const userSchema = new mongoose.Schema({
    
        email: {
          type: String,
          required: [true, "please add a valid email"],
          unique: true,
          trim:true,
        },
        phone:{
            type: String,
            required: [true, "please add a valid phone number"],
        },
        firstname:{
            type: String,
            required: [true, "please add lastname"],
        },
        lastname:{
            type: String,
            required: [true, "please add lastname"],
        },
        password:{
            type: String,
            required: [true, "please add a password"],
            minLength:[6, "password must contain atleast 6 character"]
        },
        photo: {
            type: String, //cloudinary
            required: [true, "please add profile url "],
        }
},{timestamps:true,versionKey:false})


//HASHING PASSWORD 
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next

    this.password = await bcrypt.hash(this.password, 10)
    next()
})
//PASSWORD CHEKING
userSchema.methods.isPasswordCorrect =async function(password){
    return await bcrypt.compare(password, this.password)
}

////ACCESS TOKEN GENERATE
userSchema.methods.generateAccessToken = async function(){
    const res= await jwt.sign(
        {
            _id: this._id,
            email: this.email,
           lastname:this.lastname,
            firstname: this.firstname
        },
        config.ACCESS_TOKEN_SECRET,
        {
            expiresIn: config.ACCESS_TOKEN_EXPIRY
        }
    )
    return res
}

const User = mongoose.model("User",userSchema)

export default User