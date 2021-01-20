// import { LayerGroup } from "leaflet";
import React from "react";
import { Polyline } from "react-leaflet";
import { sports } from "../constants";

const TripLeg = ({ id, sport, locs, toggleEdit }) => {
  return (
    <Polyline
      legId={id}
      positions={locs}
      onClick={toggleEdit}
      color={sports[sport] || "green"}
    />
  );
};

export default TripLeg;
