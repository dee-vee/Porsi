/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import moment from "moment";
import { Paper, Typography, Divider } from "@material-ui/core";
import style from "bootstrap/dist/css/bootstrap.css";
import "./style.css";

function Sunrise() {
  //import suncalc package
  var SunCalc = require("suncalc");

  //Set document title for tab name
  useEffect(() => {
    document.title = "Pachkan Calculator";
  }, []);

  //Intialize Form input states
  const [zip_code, setZipCode] = useState("08823");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  //default date time to current date time
  const [dateTime, setDateTime] = useState(
    new Date().toISOString().slice(0, 10) + "T12:00:00"
  );

  //initalize state for sun times
  const [sun, setSun] = useState({ rise: "", set: "" });

  //initalize states for calculated times
  const [porsi, setPorsi] = useState();
  const [navkarsi, setNavkarsi] = useState();
  const [sadhporsi, setSadhporsi] = useState();
  const [purimaddh, setPurimaddh] = useState();

  //Address title 
  const [addressTitle,setAddressTitle] = useState();

  //is input form validated
  const [validate, setValidate] = useState(false);

  //show parana times state
  const [show, setShow] = useState(false);

  //API key for geocoding
  const API_KEY = "AIzaSyCItqD_bz3EaNVbnFP7aXzr_Thj0slENpU";

  //handle input function
  const handleChangeZip = (e) => {
    setZipCode(e.target.value);
  };

  const handleChangeDate = (e) => {
    setDate(e.target.value);
    setDateTime(`${e.target.value}T12:00:00`);
  };

  //function to get parna times based on location input
  const getSunTimes = async () => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${zip_code}%20&key=${API_KEY}`
    );
    const payload = await response.json();

    // latitude and longitude from
    var temp_lat = payload.results[0].geometry.location.lat;
    var temp_long = payload.results[0].geometry.location.lng;

    // const temp_lat = 40.435471;
    // const temp_long = -74.555847;

    //set address title
    setAddressTitle(payload.results[0].formatted_address);

    //set sun times into variable based on input location
    var temp_sun = SunCalc.getTimes(new Date(dateTime), temp_lat, temp_long);

    //sun times
    const sunrise = moment(temp_sun.sunrise.toTimeString(), "HH:mm:ss ").format(
      "h:mm A"
    );

    const sunset = moment(temp_sun.sunset.toTimeString(), "HH:mm:ss ").format(
      "h:mm A"
    );

    setSun({
      rise: sunrise,
      set: sunset,
    });

    //convert sun times to get number of min in daylight
    const sunset_military = moment(
      temp_sun.sunset.toTimeString(),
      "HH:mm:ss "
    ).format("HH:mm");

    const daylight = moment(sunrise, "h:mm A").diff(
      moment(sunset_military, "H:mm"),
      "minutes"
    );

    // Porsi time = 25%  of min of sunlight + sunrise
    const porsi_add = (parseInt(daylight) * -1) / 4;
    const porsi_time = moment(sunrise, "h:mm A")
      .add(porsi_add, "minutes")
      .format("h:mm A");
    setPorsi(porsi_time);

    // navkarsi time = 48 min + sunrise
    const navkarsi_time = moment(sunrise, "h:mm A")
      .add(48, "minutes")
      .format("h:mm A");
    setNavkarsi(navkarsi_time);

    // sadhporsi time = 37.5%  of min of sunlight + sunrise
    const sadhporsi_add = ((parseInt(daylight) * -1) / 4) * 1.5;
    const sadhporsi_time = moment(sunrise, "h:mm A")
      .add(sadhporsi_add, "minutes")
      .format("h:mm A");
    setSadhporsi(sadhporsi_time);

    // purimaddh time = 75%  of min of sunlight + sunrise
    const purimaddh_add = parseInt(daylight) * -1 * 0.75;
    const purimaddh_time = moment(sunrise, "h:mm A")
      .add(purimaddh_add, "minutes")
      .format("h:mm A");
    setPurimaddh(purimaddh_time);

    //show times after they are calculated
    setShow(true);
  };

 //submit function for form
  const handleSubmit = async (e) => {
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      console.log("test");
    }
    if (form.checkValidity() === true) {
      e.preventDefault();
      getSunTimes();
    }

    setValidate(true);
  };

  return (
    <div>
      <div className="header">
        <Typography variant="h2" align="center">
          Pachkan Calculater
        </Typography>
      </div>
      <Divider />
      <br />
      <Form noValidate validated={validate} onSubmit={handleSubmit}>
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
      <br/>

      {show ? (
        <>
          <Typography variant="h4">{addressTitle}</Typography>
          <Paper elevation={3} className="paper-sunrise">
            <Row className="row">
              <Col>
                <Typography variant="h5">Sunrise:</Typography>
              </Col>
              <Col>
                <Typography variant="body1">{sun.rise}</Typography>
              </Col>
            </Row>
          </Paper>
          <Paper elevation={3} className="paper-day">
            <Row className="row">
              <Col>
                <Typography variant="h5">Navkarsi:</Typography>
              </Col>
              <Col>
                <Typography variant="body1">{navkarsi}</Typography>
              </Col>
            </Row>
            <Row className="row">
              <Col>
                <Typography variant="h5">Porsi:</Typography>
              </Col>
              <Col>
                <Typography variant="body1">{porsi}</Typography>
              </Col>
            </Row>
            <Row className="row">
              <Col>
                <Typography variant="h5">Sadhporsi:</Typography>
              </Col>
              <Col>
                <Typography variant="body1">{sadhporsi}</Typography>
              </Col>
            </Row>
            <Row className="row">
              <Col>
                <Typography variant="h5" className="sunset-typography" >Purimaddh-Avaddh:</Typography>
              </Col>
              <Col>
                <Typography variant="body1" className="sunset-typography">{purimaddh}</Typography>
              </Col>
            </Row>
          </Paper>
          <Paper elevation={3} className="paper-sunset">
            <Row className="row">
              <Col>
                <Typography variant="h5" className="sunset-typography">Sunset:</Typography>
              </Col>
              <Col>
                <Typography variant="body1" className="sunset-typography">{sun.set}</Typography>
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
