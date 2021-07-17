const app = require("express")();
const User = require("../models/user_model");

//Plural
app
  .route("/users")

  .post(async (req, res) => {
    const { name, password, email } = req.body;
    try {
      const user = await new User({ name, password, email });
      await user.save();
      res.status(201).send(user);
    } catch (error) {
      res.status(401).send(error.message);
    }
  })
  .delete(async (req, res) => {
    try {
      await User.deleteMany();
      res.send();
    } catch (error) {
      res.status(500).send();
    }
  });
//Single
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

    try {
      const user = await User.findById(req.params.id);

      Object.keys(req.body).forEach((key) => {
        user[key] = req.body[key];
      });

      await user.save();

      if (!user) return res.status(404).send();
      res.send(user);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

//Login
app.route("/users/login").post(async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = app;
