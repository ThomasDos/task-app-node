const app = require("express")();
const Task = require("../models/task_model");
const auth = require("../middlewares/authentication");

//Plural
app
  .route("/tasks")
  .get(auth, async (req, res) => {
    const { completed, sortBy } = req.query;
    const match = {};
    const sort = {};

    if (completed) match.completed = completed === "true" ? true : false;
    if (sortBy) {
      const parts = sortBy.split(":");
      sort[parts[0]] = parts[1] === "asc" ? 1 : -1;
    }

    try {
      await req.user
        .populate({
          path: "tasks",
          match,
          options: {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort,
          },
        })
        .execPopulate();
      res.send(req.user.tasks);
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
  .delete(auth, async (req, res) => {
    try {
      await Task.deleteMany({ owner: req.user._id });
      res.send();
    } catch (error) {
      res.status(500).send();
    }
  });

//Singular

app
  .route("/tasks/:id")
  .get(auth, async (req, res) => {
    try {
      const task = await Task.findOne({
        _id: req.params.id,
        owner: req.user._id,
      });

      if (task) {
        res.send(task);
      } else {
        res.status(404).send();
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  })
  .delete(auth, async (req, res) => {
    try {
      const result = await Task.findOneAndRemove({
        _id: req.params.id,
        owner: req.user._id,
      });
      if (!result) return res.status(404).send();
      res.send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  })
  .patch(auth, async (req, res) => {
    const { description, completed } = req.body;
    if (!description && !completed) return res.status(400).send();
    try {
      const task = await Task.findOne({
        _id: req.params.id,
        owner: req.user._id,
      });

      if (!task) return res.status(404).send();
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
