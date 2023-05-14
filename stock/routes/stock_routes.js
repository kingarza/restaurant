const express = require("express");
const router = express.Router();
const restaurant_db = require("../middleware/restaurant_db");

router.get("/stock", async (req, res) => {
  const stock = await restaurant_db.stock();
  res.status(200).send(stock);
});

router.post("/update_stock", async (req, res) => {
  await restaurant_db.update_stock(req.query);
  res.status(200).send("updated successfully");
});

module.exports = router;
