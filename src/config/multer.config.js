import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder;
        if (file.fieldname === "profiles") {
            folder = "uploads/profiles";
        } else if (file.fieldname === "products") {
            folder = "uploads/products";
        } else {
            folder = "uploads/documents";
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