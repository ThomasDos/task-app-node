const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const validator = require("validator");

const taskSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
