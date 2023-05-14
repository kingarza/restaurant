const express = require("express");
const router = express.Router();
const restaurant_db = require("../middleware/restaurant_db");

router.get("/plates", async (req, res) => {
  let plates = await restaurant_db.plates();
  res.status(200).send(plates);
});

router.get("/random_plate", async (req, res) => {
  let random_plate = await restaurant_db.random_plate();
  res.status(200).send(random_plate);
});

router.get("/plate", async (req, res) => {
  let random_plate = await restaurant_db.plate(req.query);
  res.status(200).send(random_plate);
});

module.exports = router;
