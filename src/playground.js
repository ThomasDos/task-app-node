const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const myFunction = async () => {
  const token = jwt.sign({ _id: "abc123" }, process.env.JWT_SECRET, {
    expiresIn: "7 days",
  });

  console.log({ token });

  const data = jwt.verify(token, process.env.JWT_SECRET);
  console.log({ data });
};

myFunction();
