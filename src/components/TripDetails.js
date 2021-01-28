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

  //close this pane and open the edit form
  const handleEdit = () => {
    edit(trip);
  };

  //Open Alert
  const deleteClicked = () => {
    setShow(true);
  };

  //Delete trip_id
  const handleDelete = () => {
    deleteTrip(trip.id);
  };

  //Accept trip invitation
  const handleAccept = () => {
    acceptInvitation(trip.id);
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
      <h6 className="tab">
        {pluralize("day", duration, true)} ({formatDate(start)} -{" "}
        {formatDate(end)} )
      </h6>
    );
  };

  // Figure our the username of the trip creator
  const created = () => {
    if (!trip.id) return "";
    //get user_trip of creator
    const created = trip.user_trips.find((t) => t.created === true);
    //get user that created
    const user = trip.users.find((u) => u.id === created.user_id);
    return user.user_name;
  };

  const collaborators = (creator) => {
    //keep the creator out of the collaborators list
    const users = trip.users.filter((u) => u.user_name !== creator);
    return users.map((u, i) => {
      return i === users.length - 1 ? `${u.user_name}` : `${u.user_name}, `;
    });
  };

  const creator = created();
  const collabs = collaborators(creator);
  return (
    <div>
      <DeleteAlert
        show={show}
        item={"Trip"}
        deleteAction={handleDelete}
        closeAction={setShow}
      />
      <ListGroup>
        <ListGroup.Item>
          <h3>{name}</h3>
          <h5>Created By: {creator} </h5>
          {collabs.length ? (
            <h6 className="tab">Collaborators: {collabs} </h6>
          ) : null}
          {/* Convert start and end to simple dd/mm/yy format */}
          {presentDates(start_date, end_date)}
          <h6 className="tab">{`Distance: ${(distance / 1000).toFixed(
            2
          )} kilometers`}</h6>
          <h6 className="tab">{`Accumulated Elevation Gain: ${aeg.toFixed(
            2
          )} meters`}</h6>
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
        </ListGroup.Item>
        {legs
          .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
          .map((leg) => {
            return (
              <ListGroup.Item key={leg.id}>
                <h5>{leg.sport}</h5>
                {presentDates(leg.start_date, leg.end_date)}
                <h6 className="tab">{`Distance: ${(leg.distance / 1000).toFixed(
                  2
                )} kilometers`}</h6>
                <h6 className="tab">{`Accumulated Elevation Gain: ${leg.aeg.toFixed(
                  2
                )} meters`}</h6>
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
