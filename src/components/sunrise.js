/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import moment from "moment";
import { Paper, Typography, Divider } from "@material-ui/core";
import style from "bootstrap/dist/css/bootstrap.css";
import "./style.css";

function Sunrise() {
  var SunCalc = require("suncalc");

  const [zip_code, setZipCode] = useState("08823");
  const [date, setDate] = useState();
  const [dateTime, setDateTime] = useState();
  const [sun, setSun] = useState({ rise: "", set: "" });
  const [porsi, setPorsi] = useState();
  const [show, setShow] = useState(false);
  const [validate, setValidate] = useState(false);
  const handleChangeZip = (e) => {
    setZipCode(e.target.value);
  };

  const handleChangeDate = (e) => {
    setDate(e.target.value);
    setDateTime(`${e.target.value}T12:00:00`);
  };

  const getSunTimes = () => {
    // const response = await fetch(
    //   `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${zip_code}%20&key=AIzaSyCItqD_bz3EaNVbnFP7aXzr_Thj0slENpU`
    // );
    // const payload = await response.json();

    // var temp_lat = payload.results[0].geometry.location.lat;
    // var temp_long = payload.results[0].geometry.location.lng;

    const temp_lat = 40.435471;
    const temp_long = -74.555847;

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

    const daylight = moment(sunrise, "h:mm A").diff(
      moment(sunset_military, "H:mm"),
      "minutes"
    );
    const minToAdd = (parseInt(daylight) * -1) / 4;
    const final_time = moment(sunrise, "h:mm A")
      .add(minToAdd, "minutes")
      .format("h:mm A");
    setPorsi(final_time);

    setSun({
      rise: sunrise,
      set: sunset,
    });
  };

  const submitZip = async (e) => {
    
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      console.log("test");
    }
    if (form.checkValidity() === true) {
      e.preventDefault();
      getSunTimes();
      setShow(true);
    }

    
    setValidate(true);
  };

  return (
    <div>
      <div className="header">
        <Typography variant="h2" align="center">
          Porsi Calculater
        </Typography>
      </div>
      <Divider />
      <br />
      <Form noValidate validated={validate} onSubmit={submitZip}>
        <Form.Group className="input-row">
          <Form.Label>Zip Code</Form.Label>
          <Form.Control
            type="number"
            required
            value={zip_code}
            isValid={zip_code.length !== 0}
            onChange={handleChangeZip}
          />
          <Form.Control.Feedback type="invalid">
            Zip Code Required
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="input-row">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            required
            isValid={date ? date.length !== 0 : false}
            value={date}
            onChange={handleChangeDate}
          />
          <Form.Control.Feedback type="invalid">
            Date Required
          </Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="primary" style={{ margin: 10 }}>
          Submit
        </Button>
      </Form>

      {show ? (
        <>
          <Paper elevation={3} className="paper">
            <Row className="row">
              <Col>
                <Typography variant="h5">Sunrise:</Typography>
              </Col>
              <Col>
                <Typography variant="body1">{sun.rise}</Typography>
              </Col>
            </Row>
            <Row className="row">
              <Col>
                <Typography variant="h5">Sunset:</Typography>
              </Col>
              <Col>
                <Typography variant="body1">{sun.set}</Typography>
              </Col>
            </Row>
            <Row className="row">
              <Col>
                <Typography variant="h5">PORSI:</Typography>
              </Col>
              <Col>
                <Typography variant="body1">{porsi}</Typography>
              </Col>
            </Row>
          </Paper>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export { Sunrise };

// Simulate a location service
