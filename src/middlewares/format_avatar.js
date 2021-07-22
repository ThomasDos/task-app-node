const sharp = require("sharp");
module.exports = async (req, res, next) => {
  req.file.buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();

  next();
};
