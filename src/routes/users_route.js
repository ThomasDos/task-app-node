const app = require("express")();
const User = require("../models/user_model");
const hashingPassword = require("../middlewares/password_hashing");
const isStrongPassword = require("../utils/is_strong_password");

app
  .route("/users")

  .post(async (req, res) => {
    const { name, password, email } = req.body;

    if (!isStrongPassword(password))
      return res.status(400).send("Password is too weak");

    const hashedPassword = await hashingPassword(password);

    try {
      const doc = await User.create({ name, password: hashedPassword, email });
      res.status(201).send(doc);
    } catch (error) {
      res.status(401).send(error.message);
    }
  });

app
  .route("/users/:id")
  .get(async (req, res) => {
    try {
      const doc = await User.findById(req.params.id);
      res.send(doc);
    } catch (error) {
      res.status(400).send(error.message);
    }
  })
  .patch(async (req, res) => {
    const { name, email, password, age } = req.body;

    if (!name || !email || !password || !age)
      return res.status(400).send("Missing datas");

    if (!isStrongPassword(password))
      return res.status(400).send("Password is too weak");

    const hashedPassword = await hashingPassword(password);

    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { ...req.body, password: hashedPassword },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!user) return res.status(404).send();
      res.send(user);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

module.exports = app;
