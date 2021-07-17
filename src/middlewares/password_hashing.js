const bcrypt = require("bcrypt");
const saltRound = 10;
module.exports = async (password) => {
  const passHashed = await bcrypt.hash(password, saltRound);
  return passHashed;
};
