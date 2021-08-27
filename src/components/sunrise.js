/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

function Sunrise() {
  var SunCalc = require("suncalc");

  const [lat, setLat] = React.useState(0);
  const [long, setLong] = React.useState(0);
  const handleCoordinates = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords.latitude, position.coords.longitude);
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
    });
  };

  function onError(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(handleCoordinates, onError);

  return (
    <div>
      <button onClick={handleCoordinates}>Get Latitude and Longitude</button>
      <p>Lat is: {lat}</p>
      <p>Long is: {long}</p>
    </div>
  );
}

export { Sunrise };

// Simulate a location service
