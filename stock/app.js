// Set PORT
const PORT = 3002;

// Require modules
const express = require("express");
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const stock_routes = require("./routes/stock_routes");

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
app.use(stock_routes);
