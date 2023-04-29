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

router.post("/", (request, response, next) => {
  Developer.findById(request.body.developerId)
    .then((developer) => {
      if (!developer) {
        response.status(404).json({
          message: "Developer not found.",
        });
      }
      const project = new Project({
        _id: new mongoose.Types.ObjectId(),
        name: request.body.name,
        durationInMonths: request.body.durationInMonths,
        developerId: developer._id,
      });
      return project.save();
    })
    .then((res) => {
      response.status(201).json(res);
    })
    .catch((err) => {
      response.status(500).json(err);
    });
});

router.get("/:projectId", (request, response, next) => {
  const id = request.params.projectId;
  Project.findById(id)
    .exec()
    .then((doc) => {
      if (doc) {
        response.status(200).json(doc);
      } else {
        response.status(404).json({
          error: "Project not found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      response.status(500).json({ error: err });
    });
});

module.exports = router;
