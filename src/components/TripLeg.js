// import { LayerGroup } from "leaflet";
import React from "react";
import { Polyline } from "react-leaflet";
import { sports } from "../constants";

const TripLeg = ({ id, sport, locs, toggleEdit }) => {
  return (
    <Polyline
      legId={id}
      // This, for whatever reason, solves the persistents of editing problem after multiple re-renders
      key={Math.random()}
      positions={locs}
      onClick={toggleEdit}
      color={sports[sport] || "green"}
    />
  );
};

export default TripLeg;
