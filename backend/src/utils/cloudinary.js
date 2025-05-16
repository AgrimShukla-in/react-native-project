import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import fs from 'fs';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary =async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const result = await cloudinary.uploader.upload(localFilePath,{
            resource_type: 'auto',
        });
        fs.unlinkSync(localFilePath);
        return result ;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };