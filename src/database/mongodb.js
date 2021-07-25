const mongoose = require("mongoose");

const mongoDBAtlas = `mongodb+srv://admin:${process.env.MONGOATLAS_KEY}@task-app-db.kxhxu.mongodb.net/TaskAppDB?retryWrites=true&w=majority`;

const urlDB =
  process.env.NODE_ENV.trim() == "development"
    ? process.env.MONGODB_LOCAL
    : mongoDBAtlas;

mongoose.connect(urlDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
// .then(() => console.log("The database is connected on " + urlDB))
// .catch((err) => console.log(err));
