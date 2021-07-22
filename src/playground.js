// const bcrypt = require("bcrypt");
// require("dotenv").config();
// const jwt = require("jsonwebtoken");

// const myFunction = async () => {
//   const token = jwt.sign({ _id: "abc123" }, process.env.JWT_SECRET, {
//     expiresIn: "7 days",
//   });

//   console.log({ token });

//   const data = jwt.verify(token, process.env.JWT_SECRET);
//   console.log({ data });
// };

// myFunction();
const User = require("./models/user_model");

const test = async () => {
  try {
    const user = await User.find();

    console.log(user);
  } catch (error) {
    console.log({ error });
  }
};

const date = new Date();
test();
