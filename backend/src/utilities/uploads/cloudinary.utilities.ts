import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import {Request, Response} from 'express';
import { CLOUDINARY_NAME, API_KEY, API_SECRET } from '../../configurations/envKeys';

dotenv.config()

cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async(req, file)=>{
        return {
            folder: "Very-Deep-Tech"
        }
    }
})


const upload = multer({
    storage: storage,
    fileFilter: (req:Request, file, cb)=>{
        if(
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg" ||
            file.mimetype == "image/webp" ||
            file.mimetype == "image/avif"
        ){
            cb(null, true);
        }else{
            cb(null, false)
            return cb(new Error("only .png, .jpg, .jpeg, .webp format allowed"))
        }
    }
})

export default upload