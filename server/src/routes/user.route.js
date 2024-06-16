import { Router } from "express";
import { protect } from '../middlewares/authVerification.js';
import { upload } from './../middlewares/multer.js';

import {registerUser,login,logout,loggedInStatus,updateUser,changePassword,getUser,forgetPassword,resetPassword} from "../controllers/user.controller.js"



const userRouter = Router()


//USER PROFILE
userRouter.route("/register").post(upload.single("photo"),registerUser)
userRouter.route("/login").post(login)
userRouter.route("/logout").get(logout)
userRouter.route("/getUser").get(protect, getUser)
userRouter.route("/loggedIn").get(loggedInStatus)
userRouter.route("/updateUser").put(protect,upload.single("photo"),updateUser)
userRouter.route("/changePassword").patch(protect, changePassword)
userRouter.route("/forgetPassword").post(forgetPassword)
userRouter.route("/resetpassword/:resetToken").put(resetPassword)





export {userRouter}