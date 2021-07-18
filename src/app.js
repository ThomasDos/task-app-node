//Dependencies
const app = require("express")();

//App Configs
require("./configs/configs")(app);

//Middlewares
// app.use((req, res, next) => {
//   res
//     .status(503)
//     .send("Server is currently in maintenance, please try again soon!");
// });

//Router
require("./configs/router")(app);

//DB
require("./database/mongodb");

//Server
require("./configs/server")(app);
