const express = require("express");
const router = express.Router();
const Project = require("../model/project");

router.get("/", (request, response, next) => {
  Project.find()
    .exec()
    .then((doc) => {
      const res = {
        count: doc.length,
        projects: doc,
      };
      response.status(200).json(res);
    })
    .catch((err) => {
      response.status(500).json({
        error: err,
      });
    });
});

router.delete("/:projectId", (request, response, next) => {
  const id = request.params.projectId;
  Project.deleteOne({ _id: id })
    .exec()
    .then((res) => {
      response.status(200).json({
        message: "Project deleted",
      });
    })
    .catch((err) => {
      response.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
