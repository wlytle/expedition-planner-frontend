import React from "react";
import pluralize from "pluralize";
import { Link } from "react-router-dom";
import SubmitButton from "./SubmitButton";

const TripDetails = ({ trip }) => {
  const { name, start_date, end_date, completed, id } = trip;
  //   convert UTC date strings to localtime dates and get trip duration
  const start = new Date(start_date);
  const end = new Date(end_date);
  // get trip duration add 1 to account for the first day
  const duration = (end - start) / 1000 / 3600 / 24 + 1;
  return (
    <div>
      <h3>{name}</h3>
      {/* Convert start and end to simple dd/mm/yy format */}
      <h5>
        {pluralize("day", duration, true)} (
        {Intl.DateTimeFormat("en-US").format(start)} -{" "}
        {Intl.DateTimeFormat("en-US").format(end)} )
      </h5>
      <h5>Completed: {completed}</h5>
      <Link to={`/trip/${id}`}>
        <SubmitButton btnTxt={"Edit Trip"} />
      </Link>
    </div>
  );
};

export default TripDetails;
