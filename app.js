const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const developerRoutes = require("./api/routes/developers");
const projectsRoutes = require("./api/routes/projects");
const usersRoutes = require("./api/routes/users");

mongoose.connect("");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "*");
  if (request.method === "OPTIONS") {
    response.header(
      "Access-Control-Allow-Methods",
      "PUT, GET, POST, DELETE, PATCH"
    );
    return response.status(200).json();
  }
  next();
});

app.use("/developers", developerRoutes);
app.use("/projects", projectsRoutes);
app.use("/users", usersRoutes);

app.use((request, response, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, request, response, next) => {
  return response.status(error.status || 500).json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
