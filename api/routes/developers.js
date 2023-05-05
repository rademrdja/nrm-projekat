const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/check-auth");

const Developer = require("../model/developer");

router.get("/", (request, response, next) => {
  Developer.find()
    .select("name specialisation _id")
    .exec()
    .then((doc) => {
      const res = {
        count: doc.length,
        developers: doc,
      };
      response.status(200).json(res);
    })
    .catch((err) => {
      response.status(500).json({
        error: err,
      });
    });
});

router.post("/", (request, response, next) => {
  const developer = new Developer({
    _id: new mongoose.Types.ObjectId(),
    name: request.body.name,
    specialisation: request.body.specialisation,
  });
  developer
    .save()
    .then((res) => {
      console.log(res);
      response.status(201).json({
        message: "Create developer success",
        createdDeveloper: developer,
      });
    })
    .catch((err) => {
      console.log(err);
      response.status(500).json({
        error: err,
      });
    });
});

router.get("/:developerId", (request, response, next) => {
  const id = request.params.developerId;
  Developer.findById(id)
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        response.status(200).json(doc);
      } else {
        response.status(404).json({
          error: "Not found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      response.status(500).json({ error: err });
    });
});

router.patch("/:developerId", (request, response, next) => {
  const id = request.params.developerId;
  const updateObject = {};
  for (let props in request.body) {
    updateObject[props] = request.body[props];
  }
  Developer.updateOne(
    { _id: id },
    {
      $set: updateObject,
    }
  )
    .exec()
    .then((docs) => {
      response.status(200).json(docs);
    })
    .catch((err) => {
      response.status(500).json({
        error: err,
      });
    });
});

router.delete("/:developerId", auth, (request, response, next) => {
  const id = request.params.developerId;
  Developer.deleteOne({ _id: id })
    .exec()
    .then((res) => {
      response.status(200).json({
        message: "Developer deleted",
      });
    })
    .catch((err) => {
      response.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
