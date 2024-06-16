

import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import User  from "../models/user.model.js";
import Token  from "../models/token.model.js";
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js";
import{uploadOnCloudinary} from "./../utils/uploadFileOnCloud.js"
import { config } from "../config/config.js";
 import crypto from  "crypto"
import { SendEmailUtility } from "../utils/EmailHelper.js";

//common 

const options = {
    httpOnly: true,
    secure: true
}



//registration
export const registerUser = asyncHandler(async (req,res,next)=>{

    // get user details from frontend
    const {firstname,lastname,email,password,phone}= req.body

    // validation -not empty
    if (
        [firstname,lastname,email,password,phone].some((field)=>field?.trim()=== "")
    ) {
        return next (new ErrorHandler("All field are required",400))
    }


    // check if user already exists
    const existedUser = await User.findOne({
        email:email
    })
    if (existedUser) {
        return next(new ErrorHandler("Username Or Email is Alreary Exist",409))
    }

    // check for images, check for photo
    const photoLocalPath = req.file.path 
    

    if (!photoLocalPath) {
        return  next (new ErrorHandler("photo is required",400))
    }



    // upload them to cloudinary, avater
    const photo = await uploadOnCloudinary(photoLocalPath);
    

    if(!photo){
        return next (new ErrorHandler("photo is required",400))
    }

    // crate user object - create entry in db
   const user = await User.create({
        firstname,
        lastname,
        email,
        phone,
        photo: photo.url,
        password,
       
    })
// generateToken
   const accessToken = await user.generateAccessToken()

   if(!accessToken){
     return next (new ErrorHandler("Token Creatation fail ",500))
   }



    // remove password and refresh token field from response
   const createUser = await User.findById(user._id).select(
    "-password"
   )

   // check for user creation
   if (!createUser) {
       return next (new ErrorHandler("Something went wrong while user registering is not ",500))
   }
   res.status(201)
   .cookie("accessToken",accessToken,options)
    .json(
    {
        message: "success",
        data: createUser,
        accessToken: accessToken
    }
   )


})

//login
export const login = asyncHandler(async (req, res,next) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, password} = req.body
    
    if (!email) {
       return next (new ErrorHandler( "invalid credential",400))
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     next new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        email:email
    })

    if (!user) {
       return next (new ErrorHandler( "User does not exist",404))
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
        return next (new ErrorHandler( "Invalid user credentials",401))
    }

   const accessToken = await user.generateAccessToken()

    const loggedInUser = await User.findById(user._id).select("-password")

    

     res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
        {
            message: "success",
            data: loggedInUser,
            accessToken: accessToken
        }
       )
   

})


//logout
export const logout = asyncHandler(async (req,res,next)=>{
    
    res
    .status(200)
    .clearCookie("accessToken", options)
    .json(
        {
            status: 200,
            message: "User logged Out"
        }
    )
})

//get user
export const getUser =asyncHandler(async (req,res,next)=>{

    const user = await User.findById(req.user._id)
    if(!user){
        return next (new ErrorHandler( "user not found",400))
    }

    const showProfile = await User.findById(user._id).select("-password -createdAt -updatedAt")
    
    res.status(200).json({message: "success",data: showProfile})
})


//logged in status
export const loggedInStatus = asyncHandler(async (req,res)=>{
    const userAccessToken =req.cookies.accessToken
    if(!userAccessToken){
        return res.json(false)
    }

    // verifyToke
    let verifyToken = await jwt.verify(userAccessToken,config.ACCESS_TOKEN_SECRET)
    if(verifyToken){
        return res.json(true)
    }
    res.json(false)
})


//update user
export const updateUser = asyncHandler(async(req, res,next) => {
    const user = await User.findById(req.user._id)

  
    if(!user){
        
       return next (new ErrorHandler( "user not found",400))
    }

    const{firstname,lastname,email,phone, photo }= user

    // check for images, check for photo

    let updateUser;


   if(req.file){
    const photoLocalPath = req.file.path 

    if (!photoLocalPath) {
        
       return next (new ErrorHandler( "photo is required",400))
    }


    // upload them to cloudinary, avater
    const incomingphoto = await uploadOnCloudinary(photoLocalPath);
    
    if(!incomingphoto){
       
        return next (new ErrorHandler( "photo is required",400))
    }

    user.email =  email
    user.firstname = req.body.firstname || firstname
    user.lastname = req.body.lastname || lastname
    user.phone = req.body.phone || phone
    user.photo = incomingphoto.url

    updateUser = await user.save()
   }else{
    user.email =  email
    user.firstname = req.body.firstname || firstname
    user.lastname = req.body.lastname || lastname
    user.phone = req.body.phone || phone
    
    updateUser = await user.save()
   }



     res
    .status(200)
    .json(
        {
            message: "success",
            data: updateUser,
           
        }
    )
})



//changePassword
export const changePassword = asyncHandler(async (req,res,next)=>{

    const {oldPassword,newPassword,confirmPassword} = req.body

    if (
        [oldPassword,newPassword,confirmPassword].some((field)=>field?.trim()=== "")
    ) {
       return next (new ErrorHandler("Password is required",400))
    }

    if(!(newPassword===confirmPassword)){
       return next (new ErrorHandler("Password are not match",400))
    }


    //find user
    let userExist = await User.findById(req.user._id) 

    if(!userExist){
        return next (new ErrorHandler("user does not exist",400))
    }

    const isPasswordValid = await userExist.isPasswordCorrect(oldPassword)

    if(!isPasswordValid){
       return next (new ErrorHandler("invalid password",400))
    }

     userExist.password = newPassword
    await userExist.save()

    res.status(200).json({status: "success",message: "password change successfully"})
})


//forgetPassword
export const forgetPassword = asyncHandler(async (req,res,next)=>{
    const {email}  = req.body

    const userExist = await User.findOne({email})

    if(!userExist){
        return next (new ErrorHandler("Invalid User Email ",400))
    }
    
    //create reset token
    const resetToken = crypto.randomBytes(32).toString("hex") + userExist._id
    //Hash Token before saving to database
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    //save token to db
     await new Token({
        userId: userExist._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * ( 60*1000)
    }).save()

    

    const resetUrl = `${config.FRONTEND_URL}/resetpassword/${resetToken}`

    //Reset Email
    const EmailHTML =`
    <h2>Hello ${userExist.firstname}<h2/>

    <p>Please Use The URL Below To Reset Your Password</p>
    <p>This Reset Link Is Valid For Only 30 Minutes</p>
   

    <a href="${resetUrl}" >${resetUrl} </a>
    <p>Regards...</p>
    <p>Development Team</p>
    `
    const EmailSubject = "Password Reset Request"
    const EmailTo = userExist.email
    const EmailText = "Reset The Password Correctly"
    

   
      const sentMail =await SendEmailUtility (EmailTo, EmailText,EmailHTML, EmailSubject)

      if(!sentMail){

       return res.status(200).json(
            {
                success: true,
                message: "Email not Sent Please Try again"
            }
        )
      }else{
       return res.status(200).json(
            {
                success: true,
                message: "Reset Email Sent"
            }
        )
      }

    
     })


//resetpassword
export const resetPassword = asyncHandler(async (req,res,next)=>{
    const {newPassword,confirmPassword} = req.body
    const {resetToken} = req.params

    if(newPassword !== confirmPassword){
        return next (new ErrorHandler("new password & confirmPassword must be same. ",400))
    }


    //Hash Token before searching to database

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")


    const userToken = await Token.findOne({token: hashedToken,expiresAt: {$gt: Date.now()}})

    if(!userToken){
        return next (new ErrorHandler("Invalid User Token Or Expired Token ",400))
    }

    const user = await User.findOne({_id: userToken.userId})
    user.password = newPassword
    await user.save()

    res.status(200).json({message: "password reset successfully. please Login"})
})

