const multer = require("multer");
module.exports = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("File must be an Image"));
    } else {
      cb(undefined, true);
    }
  },
});
