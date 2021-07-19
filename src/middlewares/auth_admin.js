module.exports = async (req, res, next) => {
  if (!req.user.admin) return res.status(401).send("Not An Admin!");
  next();
};
