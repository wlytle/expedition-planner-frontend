// import { LayerGroup } from "leaflet";
import React from "react";
import { Polyline } from "react-leaflet";

const TripLeg = ({ id, sport, locs, editRef }) => {
  // const enableEdit = (e) => {
  //   editRef.current.leafletElement._toolbars.edit._modes.edit.handler.enable();
  // };
  return <Polyline legId={id} positions={locs} />;
};

export default TripLeg;
