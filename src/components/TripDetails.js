import React from "react";
import pluralize from "pluralize";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import SubmitButton from "./SubmitButton";

const TripDetails = ({ trip, edit }) => {
  const { name, start_date, end_date, completed, id, legs } = trip;
  const distance = legs.reduce((accum, { distance }) => accum + distance, 0);
  const aeg = legs.reduce((accum, { aeg }) => accum + aeg, 0);

  //   convert UTC date strings to localtime dates and get trip duration
  const start = new Date(start_date);
  const end = new Date(end_date);
  // get trip duration add 1 to account for the first day
  const duration = (end - start) / 1000 / 3600 / 24 + 1;

  //close this pane and open the edit form
  const handleEdit = () => {
    const curPane = document.getElementById(
      `list-group-trips-tabpane-#${trip.id}`
    );
    curPane.setAttribute("aria-hidden", true);
    curPane.className = "fade tab-pane";
    edit(trip);
  };

  return (
    <div>
      <h3>{name}</h3>
      {/* Convert start and end to simple dd/mm/yy format */}
      <h5>
        {pluralize("day", duration, true)} (
        {Intl.DateTimeFormat("en-US").format(start)} -{" "}
        {Intl.DateTimeFormat("en-US").format(end)} )
      </h5>
      <h6>{`Distance: ${(distance / 1000).toFixed(2)} kilometers`}</h6>
      <h6>{`Accumulated Elevation Gain: ${aeg.toFixed(2)} meters`}</h6>
      {completed ? <h6>Trip Complete! Nice work!</h6> : null}

      <Link to={`/trip/${id}`}>
        <SubmitButton btnTxt={"Map"} />
      </Link>
      <Button
        className="form-btn"
        variant="outline-success"
        href="#editTrip"
        onClick={handleEdit}
      >
        Edit
      </Button>
      <Button className="form-btn" variant="outline-success">
        Stats
      </Button>
      <Button className="form-btn" variant="outline-danger">
        Delete
      </Button>
    </div>
  );
};

export default TripDetails;
