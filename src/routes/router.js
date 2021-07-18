const express = require("express");
const router = express.Router();
//Routes
const middlewaresRouter = require("../middlewares/middlewares_router");
const usersRoute = require("./users_route");
const tasksRoute = require("./tasks_route");
//Router
router.use(middlewaresRouter);
router.use(usersRoute, tasksRoute);

module.exports = router;
