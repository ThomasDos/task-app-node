//App
const app = require("express")();

//App Configs
require("./configs/configs")(app);

app.get("/test", (req, res) => {
  res.send("RESPONSE TEST");
});

//Router
require("./configs/router")(app);

//DB
require("./database/mongodb");

//Server
require("./configs/server")(app);
