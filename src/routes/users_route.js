const app = require("express")();
const User = require("../models/user_model");
const auth = require("../middlewares/authentification");
const authAdmin = require("../middlewares/auth_admin");
const passwordHashing = require("../utils/password_hashing");

//Plural
app
  .route("/users")
  .get(auth, authAdmin, async (req, res) => {
    try {
      const users = await User.find();
      res.send(users);
    } catch (error) {
      res.status(500).send(error.message);
    }
  })

  .post(async (req, res) => {
    let { name, password, email } = req.body;
    password = await passwordHashing(password);
    const user = new User({ name, password, email });
    try {
      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({ user, token });
    } catch (error) {
      res.status(401).send(error.message);
    }
  })
  .delete(auth, authAdmin, async (req, res) => {
    try {
      await User.deleteMany();
      res.send();
    } catch (error) {
      res.status(500).send();
    }
  });

//User me
app.route("/users/me").get(auth, (req, res) => {
  res.send(req.user);
});

//Logout All
app.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("Logout all successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Logout
app.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((tokenObject) => {
      return tokenObject.token !== req.token;
    });

    await req.user.save();
    res.send("Logout successfully");
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
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(500).send(error.message);
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
      password = await passwordHashing(password);
      user.password = password;
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

module.exports = app;
