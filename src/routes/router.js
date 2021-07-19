const express = require("express");
const router = express.Router();
//Routes
const usersRoute = require("./users_route");
const tasksRoute = require("./tasks_route");
//Router
router.use(usersRoute, tasksRoute);

module.exports = router;
