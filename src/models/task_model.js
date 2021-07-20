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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

// taskSchema.pre("save", async function (next) {
//   const task = this;

//   const { description, completed } = task;

//   next();
// });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
