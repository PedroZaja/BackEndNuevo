import multer from "multer";
import __dirname from "../util.js";
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder;
        console.log("Archivo cargado:");
        console.log(file);
        if (file.fieldname === "profiles") {
            folder = path.join(__dirname +'/uploads/profiles');
        } else if (file.fieldname === "products") {
            folder = path.join(__dirname +'/uploads/products');
        } else {
            folder = path.join(__dirname +'/uploads/documents');
        }
        
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

const uploadConfig = multer({ storage });

export default uploadConfig;