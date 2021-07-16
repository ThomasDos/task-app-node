const bcrypt = require("bcrypt");
const saltRound = 10;
module.exports = async (password) => {
  return await bcrypt.hash(password, saltRound);
};
