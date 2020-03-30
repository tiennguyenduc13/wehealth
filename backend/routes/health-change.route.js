const express = require("express");
const app = express();
const healthChangeRoutes = express.Router();

// Require HealthChange model in our routes module
let HealthChange = require("../models/HealthChange");

// Defined store route
healthChangeRoutes.route("/add").post(function(req, res) {
  let healthChange = new HealthChange(req.body);
  console.log("ttt saving ", healthChange);
  healthChange
    .save()
    .then(healthChange => {
      console.log("tttr result ", healthChange);
      res
        .status(200)
        .json({ healthChange: "healthChange in added successfully" });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
healthChangeRoutes.route("/").get(function(req, res) {
  HealthChange.find(function(err, healthChangees) {
    if (err) {
      console.log(err);
    } else {
      res.json(healthChangees);
    }
  });
});

// Defined edit route
healthChangeRoutes.route("/edit/:id").get(function(req, res) {
  let id = req.params.id;
  HealthChange.findById(id, function(err, healthChange) {
    res.json(healthChange);
  });
});

//  Defined update route
healthChangeRoutes.route("/update/:id").post(function(req, res) {
  HealthChange.findById(req.params.id, function(err, next, healthChange) {
    if (!healthChange) return next(new Error("Could not load Document"));
    else {
      healthChange.person_name = req.body.person_name;
      healthChange.healthChange_name = req.body.healthChange_name;
      healthChange.healthChange_gst_number = req.body.healthChange_gst_number;

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
