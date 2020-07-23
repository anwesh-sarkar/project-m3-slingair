"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { flights } = require("./test-data/flightSeating");
const { reservations } = require("./test-data/reservations.js");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 8000;

//display the available flights in the dropdown as per flightSeating.js
const handleFlight = (req, res) => {
  const { flightNumber } = req.params;
  // get all flight numbers
  const allFlights = Object.keys(flights);
  // is flightNumber in the array?
  //console.log("REAL FLIGHT: ", allFlights.includes(flightNumber));
  res.status(200).render("index", { allFlights });
};

// get the user input from seat-select page and find available and occupied seats through seat-select.js
const handleSeatAvailability = (req, res) => {
  const { flightNumber } = req.params;
  const flightSeatDetails = flights[flightNumber];
  res.status(200).send(flightSeatDetails);
};

const handleUser = (req, res) => {
  const { givenName, surname, email, seatNumber, flight } = req.body;
  const missingUserInput =
    !givenName || !surname || !email || !seatNumber || !flight;

  if (missingUserInput) {
    res.status(400).send("Bad Request");
  } else {
    let user = {
      id: uuidv4(),
      givenName: givenName,
      surname: surname,
      email: email,
      flight: flight,
      seat: seatNumber,
    };
    console.log(user);
    reservations.push(user);

    res.status(201).json({ id: user.id });
  }
};

const handleConfirmation = (req, res) => {
  let userId = req.params.id;
  let user = reservations.find((user) => user.id === userId);
  console.log("User Reservation:", user);
  res.status(200).render("confirmed", { user: user });
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

  // endpoint for getting the seat select page and displaying the dropdown with available flights
  .get("/seat-select", handleFlight)

  //endpoint for getting the user selected flight and displaying the seat availability
  .get("/flights/:flightNumber", handleSeatAvailability)

  .post("/users", handleUser)

  .get("/confirmed/:id", handleConfirmation)

  .use((req, res) => res.send("Not Found"))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
