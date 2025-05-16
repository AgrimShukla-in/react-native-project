import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp');
    },
    filename: function (req, file, cb) {
        const random = crypto.randomBytes(16).toString('hex'); 
        cb(null, random + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

export { upload };