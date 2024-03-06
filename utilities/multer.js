import multer from "multer";
import path from "path";

const uploadMultiple = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).array("image", 12);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2000000 },
  fileFilter: async function (req, file, cb) {
  checkFileType(file, cb);
  }
}).single("image");

// // Check file Type
function checkFileType(file, cb) {

  // Allowed ext
  const fileTypes = /jpeg|jpg|png|gif|bmp|webp/;
  // Check ext
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: Images Only !!!");
  }
}

export {
  uploadMultiple,
  upload
};