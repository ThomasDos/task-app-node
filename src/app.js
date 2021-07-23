//App
const app = require("express")();

//App Configs
require("./configs/configs")(app);

//Router
require("./configs/router")(app);

//DB
require("./database/mongodb");

//Server
require("./configs/server")(app);
