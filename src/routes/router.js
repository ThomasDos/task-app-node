const express = require("express");
const router = express.Router();

const usersRoute = require("./users_route");
const tasksRoute = require("./tasks_route");

router.use(usersRoute, tasksRoute);

module.exports = router;
