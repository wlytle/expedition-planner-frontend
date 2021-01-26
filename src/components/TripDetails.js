import React, { useState } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import pluralize from "pluralize";
import { Link } from "react-router-dom";
import { Button, ListGroup } from "react-bootstrap";
import {
  deleteTrip,
  acceptInvitation,
  declineInvitation,
} from "../actions/TripActions";
import SubmitButton from "./SubmitButton";
import DeleteAlert from "./DeleteAlert";

const TripDetails = ({
  trip,
  edit,
  deleteTrip,
  acceptInvitation,
  declineInvitation,
}) => {
  const [show, setShow] = useState(false);
  const location = useLocation();

  const { name, start_date, end_date, completed, id, legs, notes } = trip;
  const distance = legs.reduce((accum, { distance }) => accum + distance, 0);
  const aeg = legs.reduce((accum, { aeg }) => accum + aeg, 0);

  //close current pane
  const closePane = (id) => {
    const curPane = document.getElementById(`list-group-trips-tabpane-#${id}`);
    curPane.setAttribute("aria-hidden", true);
    curPane.className = "fade tab-pane";
  };

  //close this pane and open the edit form
  const handleEdit = () => {
    closePane(trip.id);
    edit(trip);
  };

  //Open Alert
  const deleteClicked = () => {
    setShow(true);
  };

  //Delete trip_id
  const handleDelete = () => {
    deleteTrip(trip.id);
    closePane(trip.id);
  };

  //Accept trip invitation
  const handleAccept = () => {
    acceptInvitation(trip.id);
    closePane(trip.id);
  };

  //Decline trip invitation
  const handleDecline = () => {
    declineInvitation(trip.id);
  };

  //make datetime objects
  const makeDate = (date) => {
    //   convert UTC date strings to localtime dates and get trip duration
    return new Date(date);
  };

  // formate date strings as date objects
  const formatDate = (date) => {
    return Intl.DateTimeFormat("en-US").format(date);
  };

  //Set dates up to be presented nicely with number of days
  const presentDates = (start, end) => {
    start = makeDate(start);
    end = makeDate(end);
    // get trip duration add 1 to account for the first day
    const duration = (end - start) / 1000 / 3600 / 24 + 1;
    return (
      <h6>
        {pluralize("day", duration, true)} ({formatDate(start)} -{" "}
        {formatDate(end)} )
      </h6>
    );
  };

  return (
    <div>
      <DeleteAlert
        show={show}
        item={"Trip"}
        deleteAction={handleDelete}
        closeAction={setShow}
      />
      <h3>{name}</h3>
      {/* Convert start and end to simple dd/mm/yy format */}
      {presentDates(start_date, end_date)}
      <h6>{`Distance: ${(distance / 1000).toFixed(2)} kilometers`}</h6>
      <h6>{`Accumulated Elevation Gain: ${aeg.toFixed(2)} meters`}</h6>
      <p>{notes}</p>
      {location.pathname === "/profile" ? (
        <>
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
          <Button
            className="form-btn"
            variant="outline-danger"
            onClick={deleteClicked}
          >
            Delete
          </Button>
        </>
      ) : (
        <>
          <Button
            className="form-btn"
            variant="outline-success"
            onClick={handleAccept}
          >
            Accept
          </Button>
          <Button
            className="form-btn"
            variant="outline-danger"
            onClick={handleDecline}
          >
            Decline
          </Button>
        </>
      )}
      {completed ? <h6>Trip Complete! Nice work!</h6> : null}
      <ListGroup>
        {legs
          .sort((a, b) => formatDate(a.date) - formatDate(a.date))
          .map((leg) => {
            return (
              <ListGroup.Item key={leg.id}>
                <h5>{leg.sport}</h5>
                {presentDates(leg.start_date, leg.end_date)}
                <p>{`Distance: ${(leg.distance / 1000).toFixed(
                  2
                )} kilometers`}</p>
                <p>{`Accumulated Elevation Gain: ${leg.aeg.toFixed(
                  2
                )} meters`}</p>
                <p>{leg.notes}</p>
              </ListGroup.Item>
            );
          })}
      </ListGroup>
    </div>
  );
};

export default connect(null, {
  deleteTrip,
  acceptInvitation,
  declineInvitation,
})(TripDetails);
