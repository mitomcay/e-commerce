import multer from "multer";
import path from "path";

// Cấu hình storage cho multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/"); // Thư mục lưu trữ file
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
});

// Middleware `multer` với cấu hình storage
const upload = multer({ storage });

export default upload;
