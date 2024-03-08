const fs = require("fs");

const { v2 } = require("cloudinary");

v2.config({
   
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

  });
  
// upload image on cloudinary
const uploadOnCloudinary= async(localFilePath)=>{
    try {
        if (!localFilePath) return null;
        const response = await v2.uploader.upload(localFilePath, {
          resource_type: "auto",
        });
    
        console.log("file Path : ", response.url, response);
          // console.log("file Path : ", localFilePath);
           if(response.url){
            
            fs.unlinkSync(localFilePath);
            return response.url;
           }
        throw new Error("Url of image not generated")
      } catch (error) {
        fs.unlinkSync(localFilePath);
        // console.log("error  : ", error);
        return error.message
      }
}
  

module.exports = uploadOnCloudinary;