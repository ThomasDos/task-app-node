const jwt = require("jsonwebtoken");
const User = require("../models/user_model");

module.exports = async (req, res, next) => {
  try {
    if (!req.header("Authorization"))
      return res.status(401).send("Please authenticate");
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) throw new Error("Couldnt find user");
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send(error.message);
  }
};
