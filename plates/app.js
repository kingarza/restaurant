// Set PORT
const PORT = 3001;

// Require modules
const express = require("express");
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const plates_routes = require("./routes/plates_routes");

// Create an express app
const app = express();

// Init dotenv
dotenv.config();

// Listen for requests
app.listen(PORT);

// Set view engine
app.set("view engine", "ejs");

// Allow interpreting data sent through HTTP requests in JSON format
app.use(bodyParser.json());

// Endpoints
app.use(plates_routes);
