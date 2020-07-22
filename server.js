"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { flights } = require("./test-data/flightSeating");

const PORT = process.env.PORT || 8000;

const handleFlight = (req, res) => {
  const { flightNumber } = req.params;
  // get all flight numbers
  const allFlights = Object.keys(flights);
  // is flightNumber in the array?
  console.log("REAL FLIGHT: ", allFlights.includes(flightNumber));
};

const handleFlightSelect = (req, res) => {
  const flightNumbers = Object.keys(flights);
  console.log(flightNumbers);
  res.status(200).render("index.ejs", { flightNumbers });
};

const handleSeatDetails = (req, res) => {
  const { flightNumber } = req.params;
  console.log(flightNumber);
  const flightSeatDetails = flights[flightNumber];
  console.log(flightSeatDetails);
  res.status(200).send(flightSeatDetails);
};

express()
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints
  .get("/seat-select", handleFlightSelect)
  .get("/flights/:flightNumber", handleSeatDetails)

  .use((req, res) => res.send("Not Found"))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
