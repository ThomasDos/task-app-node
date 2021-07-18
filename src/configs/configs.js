const express = require("express");

module.exports = (app) => {
  require("dotenv").config();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};
