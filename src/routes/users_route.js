const app = require("express")();
const User = require("../models/user_model");

app
  .route("/users")

  .post((req, res) => {
    console.log(req.body);

    const { name, password, email } = req.body;

    User.create({ name, password, email }, (err, doc) => {
      if (err) {
        console.log("error : ", err.message);
        res.json({ errorMessage: err.message, error: true });
      } else {
        console.log(doc.name, "is successfully created");
        res.send(doc);
      }
    });
  });

app.route("/users/:id").get((req, res) => {
  User.findById(req.params.id, (err, doc) => {
    if (err) console.log("error on research :", err.message);
    console.log(doc.name, "is successfully connected");
    res.send(doc);
  });
});

module.exports = app;
