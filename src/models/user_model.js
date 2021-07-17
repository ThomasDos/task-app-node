const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const validator = require("validator");
const isStrongPassword = require("../utils/is_strong_password");
const hashingPassword = require("../middlewares/password_hashing");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: Number,
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (
          !validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            returnScore: false,
          })
        ) {
          throw new Error("Password isn't strong enough");
        }
      },
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
  },
  { timestamps: true }
);

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Unable to login");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Unable to login");

  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (!isStrongPassword(user.password))
    return res.status(400).send("Password is too weak");

  user.password = await hashingPassword(user.password);

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;