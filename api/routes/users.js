const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

router.post("/signup", (request, response, next) => {
  User.find({
    mail: request.body.mail,
  })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return response.status(409).json({
          error: "Mail exists in database",
        });
      } else {
        bcrypt.hash(request.body.password, 10, (err, hash) => {
          if (err) {
            return response.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              mail: request.body.mail,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                return response.status(200).json({
                  message: "User created",
                  user: result,
                });
              })
              .catch((err) => {
                return response.status(500).json({
                  message: "Error happened",
                });
              });
          }
        });
      }
    });
});

router.post("/login", (request, response, next) => {
  User.find({
    mail: request.body.mail,
  })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return response.status(401).json({
          message: "Auth failed.",
        });
      } else {
        bcrypt.compare(request.body.password, user[0].password, (err, res) => {
          if (err) {
            return response.status(401).json({
              error: err,
            });
          }
          if (res) {
            const token = jwt.sign(
              {
                mail: user[0].mail,
                userId: user[0]._id,
              },
              "SECRET_KEY",
              {
                expiresIn: "1h",
              }
            );
            return response.status(200).json({
              message: "Auth successfull",
              token: token,
            });
          }
          return response.status(401).json({
            message: "Auth failed",
          });
        });
      }
    })
    .catch((err) => {
      return response.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
