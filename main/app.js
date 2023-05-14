// Set PORT
const PORT = 3000;

// Require modules
const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const bodyParser = require("body-parser");
const { response } = require("express");

// Init dotenv
dotenv.config();

// Create an express app
const app = express();

// Listen for requests
app.listen(PORT);

// Set view engine
app.set("view engine", "ejs");

// Allow interpreting data sent through HTTP requests in JSON format
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  // Get stock
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${process.env.STOCK_SERVICE_URL}/stock`,
    headers: {},
  };

  let response = await axios(config);
  const stock = response.data;

  // Get plates
  config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${process.env.PLATES_SERVICE_URL}/plates`,
    headers: {},
  };

  response = await axios(config);
  const plates = response.data;

  // Get orders, where status = in_progress
  config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${process.env.ORDERS_SERVICE_URL}/orders_by_status?status=in_progress`,
    headers: {},
  };

  response = await axios(config);
  const orders_in_progress = response.data;

  // Get orders, where status = done
  config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${process.env.ORDERS_SERVICE_URL}/orders_by_status?status=done`,
    headers: {},
  };

  response = await axios(config);
  const orders_done = response.data;

  res.render("index", { stock, plates, orders_in_progress, orders_done });
});

app.get("/process_order", async (req, res) => {
  // Create order
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${process.env.ORDERS_SERVICE_URL}/create_order`,
    headers: {},
  };
  let response = await axios(config);
  const orders = response.data;
  const order = orders[0];

  // console.log(`plate ${order.plate}`);
  // console.log(typeof(order.plate));

  // Get plate of the order
  config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${process.env.PLATES_SERVICE_URL}/plate?id=${order.plate}`,
    headers: {},
  };
  response = await axios(config);
  const plates = response.data;
  const plate = plates[0];
  const ingr_and_qty = JSON.parse(plate.ingredients_and_quantity);

  // Get stock
  config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${process.env.STOCK_SERVICE_URL}/stock`,
    headers: {},
  };
  response = await axios(config);
  const stock = response.data;

  // Check (and buy if necessary) ingredients
  // Loop trough the ingredients and their quantities

  // console.log(`order ${JSON.stringify(order)}`);
  // console.log(`ingr_and_qty ${JSON.stringify(ingr_and_qty)}`);
  for (const raw_ingredient in ingr_and_qty) {
    const ingredient = raw_ingredient.trim();
    const qty = parseInt(ingr_and_qty[ingredient]);
    for (const item of stock) {
      const stock_ingredient = item.ingredient.trim();
      // console.log(`stock_ingredient ${stock_ingredient}`);
      if (stock_ingredient === ingredient) {
        let stockQty = item.quantity;
        // console.log(`stockQty ${stockQty}`);
        while (stockQty < qty) {
          // buy ingredient
          config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${process.env.MARKET_ENDPOINT_URL}?ingredient=${ingredient}`,
            headers: {},
          };
          response = await axios(config);
          const ingredientSold = response.data;
          // console.log(`ingredientSold.quantitySold ${ingredientSold.quantitySold}`);
          if (ingredientSold.quantitySold > 0) {
            // update stock
            config = {
              method: "post",
              maxBodyLength: Infinity,
              url: `${process.env.STOCK_SERVICE_URL}/update_stock?ingredient=${ingredient}&qty=${ingredientSold.quantitySold}`,
              headers: {},
            };
            await axios(config);
            stockQty += ingredientSold.quantitySold;
          }
        }
        // update stock, rest the quantity used
        config = {
          method: "post",
          maxBodyLength: Infinity,
          url: `${
            process.env.STOCK_SERVICE_URL
          }/update_stock?ingredient=${ingredient}&qty=${-qty}`,
          headers: {},
        };
        await axios(config);

        // update order, where status = done
        config = {
          method: "post",
          maxBodyLength: Infinity,
          url: `${process.env.ORDERS_SERVICE_URL}/update_order_by_status?id=${order.id}&status=done`,
          headers: {},
        };
        axios(config);
      }
    }
  }
});

// 404 page
app.use((req, res) => {
  res.render("404");
});
