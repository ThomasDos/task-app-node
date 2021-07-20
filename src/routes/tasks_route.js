const app = require("express")();
const Task = require("../models/task_model");
const auth = require("../middlewares/authentification");

//Plural
app
  .route("/tasks")
  .get(async (req, res) => {
    try {
      const tasks = await Task.find();
      res.send(tasks);
    } catch (err) {
      res.status(400).send(err.message);
    }
  })
  .post(auth, async (req, res) => {
    const { description, completed } = req.body;

    const { _id } = req.user;
    const task = new Task({ description, completed, owner: _id });
    try {
      await task.save();
      res.status(201).send(task);
    } catch (error) {
      res.status(400).send(error.message);
    }
  })
  .delete(async (req, res) => {
    try {
      await Task.deleteMany();
      res.send();
    } catch (error) {
      res.status(500).send();
    }
  });

//Singular

app
  .route("/tasks/:id")
  .get(async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (task) {
        res.send(task);
      } else {
        res.status(404).send();
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  })
  .delete(async (req, res) => {
    try {
      const result = await Task.findByIdAndRemove(req.params.id);
      if (!result) return res.status(400).send("Invalid data");

      res.send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  })
  .patch(async (req, res) => {
    const { description, completed } = req.body;

    if (!description || !completed) return res.status(400).send("Missing Data");

    try {
      const task = await Task.findById(req.params.id);

      if (!task) return res.status(400).send("Didnt find the task");

      Object.keys(req.body).forEach((key) => {
        task[key] = req.body[key];
      });

      task.save();

      res.send(task);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

module.exports = app;
