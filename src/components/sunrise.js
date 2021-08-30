/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import moment from "moment";

function Sunrise() {
  var SunCalc = require("suncalc");

  const [zip_code, setZipCode] = useState();
  const [date, setDate] = useState();
  const [dateTime, setDateTime] = useState();
  const [sun, setSun] = useState({ rise: "", set: "" });
  const [porsi, setPorsi] = useState();
  const handleChangeZip = (e) => {
    setZipCode(e.target.value);
  };

  const handleChangeDate = (e) => {
    setDate(e.target.value);
    setDateTime(`${e.target.value}T12:00:00`);
  };

  const submitZip = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${zip_code}%20&key=AIzaSyCItqD_bz3EaNVbnFP7aXzr_Thj0slENpU`
    );
    const payload = await response.json();

    var temp_lat = payload.results[0].geometry.location.lat;
    var temp_long = payload.results[0].geometry.location.lng;

    var temp_sun = SunCalc.getTimes(new Date(dateTime), temp_lat, temp_long);

    const sunrise = moment(temp_sun.sunrise.toTimeString(), "HH:mm:ss ").format(
      "h:mm A"
    );
   
    const sunset = moment(temp_sun.sunset.toTimeString(), "HH:mm:ss ").format(
      "h:mm A"
    );
    const sunset_military = moment(
      temp_sun.sunset.toTimeString(),
      "HH:mm:ss "
    ).format("HH:mm");

    const daylight = moment(sunrise, "h:mm A").diff(moment(sunset_military,"H:mm"),'minutes')
    const minToAdd = (parseInt(daylight)*-1)/4;
    const final_time =  moment(sunrise, "h:mm A").add(minToAdd,"minutes").format("h:mm A");
    setPorsi(final_time);

    setSun({
      rise: sunrise,
      set: sunset,
    });
  };

  return (
    <div>
      <form>
        <label>
          Zip Code:
          <input
            type="number"
            value={zip_code}
            onChange={handleChangeZip}
          ></input>
        </label>
        <label>
          Date:
          <input type="date" value={date} onChange={handleChangeDate}></input>
        </label>
        <button onClick={submitZip}>Submit</button>
      </form>

      <p>Sun Rise is: {sun.rise}</p>
      <p>SunSet is: {sun.set}</p>
      <p>Porsi Time is: {porsi}</p>
    </div>
  );
}

export { Sunrise };

// Simulate a location service
