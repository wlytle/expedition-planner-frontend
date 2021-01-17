import React from "react";
import { Polyline } from "react-leaflet";

const TripLeg = ({ locs }) => {
  return <Polyline positions={locs} />;
};

export default TripLeg;
