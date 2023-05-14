// Set PORT
const PORT = 3003;

// Require modules
const express = require("express");
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const orders_routes = require("./routes/orders_routes");

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

// Endpoints
app.use(orders_routes);
