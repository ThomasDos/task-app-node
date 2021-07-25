const app = require("express")();
const User = require("../models/user_model");
const Task = require("../models/task_model");
const auth = require("../middlewares/authentication");
const authAdmin = require("../middlewares/auth_admin");
const passwordHashing = require("../utils/password_hashing");
const uploadAvatar = require("../middlewares/user_profile");
const errorHandler = require("../middlewares/error_handler");
const formatAvatar = require("../middlewares/format_avatar");
// const {sendWelcomeMail, sendCancellationMail} = require("../services/email_service"); //! Disabled

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
      // sendWelcomeMail(email, name); --> //! Disabled
      res.status(201).send({ user, token });
    } catch (error) {
      res.status(401).send(error.message);
    }
  })
  .delete(auth, authAdmin, async (req, res) => {
    try {
      await Task.deleteMany();
      await User.deleteMany();
      res.send();
    } catch (error) {
      res.status(500).send();
    }
  });

//User me
app
  .route("/users/me")
  .get(auth, (req, res) => {
    res.send(req.user);
  })
  .patch(auth, async (req, res) => {
    const { password, admin } = req.body;

    if (admin) return res.status(401).send("Bad Boy!");

    try {
      let user = await User.findById(req.user.id);
      Object.keys(req.body).forEach((key) => {
        user[key] = req.body[key];
      });

      if (password) {
        const passwordHashed = await passwordHashing(password);
        user.password = passwordHashed;
      }

      await user.save();

      if (!user) return res.status(404).send();
      res.send(user);
    } catch (error) {
      res.status(500).send(error.message);
    }
  })
  .delete(auth, async (req, res) => {
    try {
      const {
        user,
        user: { email, name, createdAt },
      } = req;
      await user.remove();
      // sendCancelMail(email, name, createdAt);--> //! Disabled
      res.send(user);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

//Upload Profile pic

app
  .route("/users/me/avatar")
  .post(
    auth,
    uploadAvatar.single("avatar"),
    formatAvatar,
    async (req, res) => {
      try {
        req.user.avatar = req.file.buffer;
        await req.user.save();
        res.send();
      } catch (error) {
        res.status(500).send(error.message);
      }
    },
    errorHandler
  )
  .delete(auth, async (req, res) => {
    try {
      req.user.avatar = undefined;
      await req.user.save();
      res.send();
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

// Get avatar user

app.get("/users/:id/avatar", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user.avatar) return res.status(404).send();

    if (!user.id === req.user.id) return res.status(401).send();
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(500).send();
  }
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
    if (!user) return res.status(401).send();
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = app;
