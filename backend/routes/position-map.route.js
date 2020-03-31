const express = require("express");
const positionMapRoutes = express.Router();

let PositionMap = require("../models/PositionMap");

// Defined get data(index or listing) route
positionMapRoutes.route("/").get(function(req, res) {
  PositionMap.find(function(err, positionMapes) {
    if (err) {
      console.log(err);
    } else {
      res.json(positionMapes);
    }
  });
});

//  Defined update route
positionMapRoutes.route("/update/:userId").post(function(req, res) {
  const userIdToUpdate = req.params.userId;
  const positionMapToUpdate = new PositionMap(req.body);
  PositionMap.findOne({ userId: userIdToUpdate }).then(positionMap => {
    if (positionMap) {
      positionMap.position = positionMapToUpdate.position;
      positionMap.eventDate = positionMapToUpdate.eventDate;
      positionMap.healthSignals = positionMapToUpdate.healthSignals;
      //update
      positionMap
        .save()
        .then(positionMap => {
          res.json("Update complete");
        })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    } else {
      //add new
      positionMapToUpdate
        .save()
        .then(positionMap => {
          res
            .status(200)
            .json({ positionMap: "positionMap in added successfully" });
        })
        .catch(err => {
          res.status(400).send("unable to save to database");
        });
    }
  });
});

// Defined delete | remove | destroy route
positionMapRoutes.route("/delete/:id").get(function(req, res) {
  PositionMap.findByIdAndRemove({ _id: req.params.id }, function(
    err,
    positionMap
  ) {
    if (err) res.json(err);
    else res.json("Successfully removed");
  });
});

module.exports = positionMapRoutes;
