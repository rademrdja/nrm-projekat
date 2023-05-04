const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../model/user");

router.get("/", (request, response, next) => {
  User.find()
    .exec()
    .then((doc) => {
      const res = {
        count: doc.length,
        users: doc,
      };
      response.status(200).json(res);
    })
    .catch((err) => {
      response.status(500).json({
        error: err,
      });
    });
});

router.delete("/:userId", (request, response, next) => {
  User.deleteOne({ _id: request.params.userId })
    .exec()
    .then((res) => {
      return response.status(200).json({
        message: "User deleted",
      });
    })
    .catch((err) => {
      return response.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
