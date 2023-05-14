const express = require("express");
const axios = require("axios");
const router = express.Router();
const restaurant_db = require("../middleware/restaurant_db");

router.post("/orders_by_status", async (req, res) => {
  const status = req.query.status;
  const orders = await restaurant_db.orders_by_status({
    status: status,
  });
  res.status(200).send(orders);
});

router.get("/last_order_created", async (req, res) => {
  const last_order = await restaurant_db.last_order_created();
  res.status(200).send(last_order);
});

router.get("/create_order", async (req, res) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${process.env.PLATES_SERVICE_URL}/random_plate`,
    headers: {},
  };
  let response = await axios(config);

  const plates = response.data;
  const plate = plates[0];
  const { id: plate_id } = plate;
  await restaurant_db.create_order({ plate_id });

  // get the last order created
  config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${process.env.ORDERS_SERVICE_URL}/last_order_created`,
    headers: {},
  };
  response = await axios(config);
  const last_order = response.data;

  res.status(200).send(last_order);
});

router.post("/update_order_by_status", async (req, res) => {
  await restaurant_db.update_order_status(req.query);
  res.status(200).send("updated successfully");
});

module.exports = router;
