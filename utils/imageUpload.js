import multer from "multer";
import sharp from "sharp";
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadSingleImage = upload.single("image");

/**
 * @brief Resize the size of single image uploaded
 * @param {String} name -> name of image
 * @param {String} dir -> directory where image will be stored
 * @returns
 */
export const resizeSingleImage = (name, dir) => (req, res, next) => {
  if (!req.file) return next();
  req.body.image = `${name}-${req.faculty.id}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(800, 800)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/images/${dir}/${req.body.image}`);
  next();
};
