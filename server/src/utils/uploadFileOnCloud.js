import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { config } from "../config/config.js";


cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
        if (!localFilePath) return null;
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
        });

        //file uploaded successfully
        // console.log(`file is uploaded in cloudinay ${response.url}`);
        fs.unlinkSync(localFilePath)// remove the temporary file after uploaded on cloudinary
        return response;

  } catch (error) {
    fs.unlinkSync(localFilePath)// remove the temporary file as the upload faild
    return null
  }

};


export {uploadOnCloudinary}