const auth = async (req, res, next) => {
  console.log("Auth midd");

  next();
};

module.exports = auth;
