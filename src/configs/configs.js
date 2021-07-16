const express = require("express");
const router = require("../routes/router");

module.exports = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(router);
};
