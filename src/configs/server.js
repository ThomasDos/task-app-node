const port =
  process.env.NODE_ENV.trim() == "development" ? 3000 : process.env.PORT;

module.exports = (app) => {
  app.listen(port, (err) => {
    if (err) {
      console.log("Server error : " + err);
    } else {
      console.log("Server is running on port : " + port);
    }
  });
};
