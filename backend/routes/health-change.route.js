const express = require("express");
const healthChangeRoutes = express.Router();

// Require HealthChange model in our routes module
let HealthChange = require("../models/HealthChange");

// Defined store route
healthChangeRoutes.route("/add").post(function(req, res) {
  let healthChange = new HealthChange(req.body);
  healthChange
    .save()
    .then(healthChange => {
      res.status(200).json(healthChange);
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

healthChangeRoutes.route("/listByUserId/:userId").get(function(req, res) {
  const userId = req.params.userId;
  HealthChange.find({ userId: userId }, (err, healthChanges) => {
    if (err) {
      console.log(err);
    } else {
      res.json(healthChanges);
    }
  });
});

healthChangeRoutes.route("/latest/:userId").get(function(req, res) {
  const userId = req.params.userId;
  HealthChange.find({ userId: userId })
    .sort({ eventDate: -1 })
    .limit(1)
    .then(healthChanges => {
      if (healthChanges && healthChanges.length) {
        res.json(healthChanges[0]);
      } else {
        res.json({});
      }
    });
});

//  Defined update route
healthChangeRoutes.route("/update/:id").post(function(req, res) {
  const id = req.params.id;
  HealthChange.findById(id, function(err, next, healthChange) {
    if (!healthChange) return next(new Error("Could not load Document"));
    else {
      healthChange.userId = req.body.userId;

      healthChange
        .save()
        .then(healthChange => {
          res.json("Update complete");
        })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// Defined delete | remove | destroy route
healthChangeRoutes.route("/delete/:id").get(function(req, res) {
  HealthChange.findByIdAndRemove({ _id: req.params.id }, function(
    err,
    healthChange
  ) {
    if (err) res.json(err);
    else res.json("Successfully removed");
  });
});

module.exports = healthChangeRoutes;
