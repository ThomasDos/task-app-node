const app = require("express")();
const Task = require("../models/task_model");

//Plural
app
  .route("/tasks")
  .get((req, res) => {
    Task.find()
      .then((tasks) => {
        res.send(tasks);
      })
      .catch((err) => res.status(400).send(err.message));
  })
  .post((req, res) => {
    let { description, completed } = req.body;

    Task.create({ description, completed })
      .then((task) => res.status(201).send(task))
      .catch((err) => res.status(400).send(err.message));
  });

//Singular

app.route("/tasks/:id").get((req, res) => {
  Task.findById(req.params.id)
    .then((task) => {
      if (!task) {
        res.status(404).json("Sorry we didnt find any task");
      } else {
        res.send(task);
      }
    })

    .catch((err) => res.status(404).send(err.message));
});

module.exports = app;
