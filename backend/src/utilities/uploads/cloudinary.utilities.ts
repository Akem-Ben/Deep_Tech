import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import {Request, Response} from 'express';

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async(req, file)=>{
        return {
            folder: "Tia_Blog"
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