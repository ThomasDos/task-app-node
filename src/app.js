//Dependencies
const app = require("express")();

//App Configs
require("./configs/configs")(app);
//DB
require("./database/mongodb");

//Server
require("./configs/server")(app);