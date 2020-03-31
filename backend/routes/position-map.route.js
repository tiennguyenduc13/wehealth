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

positionMapRoutes.route("/updatePosition/:userId").post(function(req, res) {
  const userId = req.params.userId;
  const position = { lat: req.body.lat, lng: req.body.lng };
  PositionMap.findOne({ userId: userId }).then(positionMap => {
    if (positionMap) {
      positionMap.position = position;
      positionMap.eventDate = new Date();
      //update
      positionMap
        .save()
        .then(resData => {
          res.status(200).json(resData);
        })
        .catch(err => {
          res.status(400).send("unable to save to database");
        });
    } else {
      //add new
      const newPositionMap = new PositionMap({
        userId: userId,
        position: position,
        eventDate: new Date()
      });

      newPositionMap
        .save()
        .then(positionMap => {
          res.status(200).json({ positionMap });
        })
        .catch(err => {
          res.status(400).send("unable to save to database");
        });
    }
  });
});
positionMapRoutes.route("/list").get(function(req, res) {
  PositionMap.find({}, (err, positionMaps) => {
    if (err) {
      console.log(err);
    } else {
      res.json(positionMaps);
    }
  });
});
positionMapRoutes
  .route("/updateHealthSignals/:userId")
  .post(function(req, res) {
    const userId = req.params.userId;
    const healthSignals = req.body;
    PositionMap.findOne({ userId: userId }).then(positionMap => {
      if (positionMap) {
        positionMap.healthSignals = healthSignals;
        positionMap.eventDate = new Date();
        //update
        positionMap
          .save()
          .then(resData => {
            res.status(200).json(resData);
          })
          .catch(err => {
            res.status(400).send("unable to save to database");
          });
      } else {
        //add new
        const newPositionMap = new PositionMap({
          userId: userId,
          healthSignals: healthSignals,
          eventDate: new Date()
        });

        newPositionMap
          .save()
          .then(positionMap => {
            res.status(200).json({ positionMap });
          })
          .catch(err => {
            res.status(400).send("unable to save to database");
          });
      }
    });
  });

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
          res.json(positionMap);
        })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    } else {
      //add new
      positionMapToUpdate
        .save()
        .then(positionMap => {
          res.status(200).json({ positionMap });
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
