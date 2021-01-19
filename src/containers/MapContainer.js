import React, { useState, useRef, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { latLngBounds } from "leaflet";
import { TileLayer, Map, FeatureGroup, LayersControl } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { addLeg, getTrip, editLeg, deleteLeg } from "../actions/TripActions";
import TripLeg from "../components/TripLeg";

const MapContainer = ({ trip, addLeg, getTrip, editLeg, deleteLeg }) => {
  const [sport, setSport] = useState({ sport: "hike", color: "teal" });
  const [bounds, setBounds] = useState(null);
  // initialize ref to edit controls
  const editRef = useRef();
  const mapRef = useRef();
  const groupRef = useRef();
  const legsRef = useRef();
  // Get id of trip from route
  let { id } = useParams();
  //set up map bounds

  // const bounds = useMemo(() => {
  //   // let x = latLngBounds();
  //   // const group = groupRef?.current?.leafletElement;
  //   // return group ? group.getBounds() : null;
  //   if ()
  //   const bounds = latLngBounds();
  //   trip.locations.forEach((loc) => bounds.extend([loc.lat, loc.lng]));
  // }, [trip]);
  const center = [34, -110.0];

  //calcualte distance of polyline
  const getDistance = (locs) => {
    let distance = 0;
    for (let i = 0; i < locs.length - 1; i++) {
      distance += locs[i].distanceTo(locs[i + 1]);
    }
    return distance;
  };

  //update the backend and state on confirmation of leg created
  const _onCreate = (e) => {
    console.log(e);
    // onShapeDrawn(e);
    const { layerType, layer } = e;
    if (layerType === "marker") {
    }
    if (layerType === "polyline") {
      // calculate distance of polyline
      const distance = getDistance(layer.getLatLngs());
      // Add new leg to db and to state
      addLeg(id, {
        sport: sport.sport,
        latlngs: layer.getLatLngs(),
        distance,
      });
      //remove the layer from the drawn functional group it will be rerendered from state to allow fo identical access controls for all paaths newly created and laoded in
      const fg = editRef.current.leafletElement.options.edit.featureGroup;
      fg.removeLayer(fg._layers[e.layer._leaflet_id]);
    }
  };

  // const onShapeDrawn = (e) => {
  //   e.layer.on("click", () => {
  //     editRef.current.leafletElement._toolbars.edit._modes.edit.handler.enable();
  //   });
  //   e.layer.on("contextmenu", () => {
  //     console.log("You right clicked!");
  //   });
  //   e.layer.bindTooltip("Text", {
  //     className:
  //       "leaflet-draw-tooltip:before leaflet-draw-tooltip leaflet-draw-tooltip-visible",
  //     sticky: true,
  //     direction: "right",
  //   });
  // };

  ////update the backend and state on confirmation of leg edited
  const _onEdit = (e) => {
    console.log(e);
    const {
      layers: { _layers },
    } = e;
    Object.values(_layers).forEach((layer) => {
      // get the id of the leg beign edited
      const id = layer.options.legId;
      //get the distances between each point
      const distance = getDistance(layer.getLatLngs());
      //Check if points wre just edited or if the number of points has changed
      // Come back and optimize this
      editLeg(id, layer._latlngs, distance);
    });
  };

  //update the backend and state on confirmation of leg deleted
  const _onDelete = (e) => {
    console.log(e);
    const {
      layers: { _layers },
    } = e;
    Object.values(_layers).forEach((layer) => {
      //get the id of the leg being deleted
      const id = layer.options.legId;
      //Update the database and state with delete leg
      deleteLeg(id);
    });
  };

  // Reload current trip from database incase of page load
  useEffect(() => {
    console.log("using Effect!");
    if (trip.id && !bounds) {
      const mapBounds = latLngBounds();
      trip.locations.forEach((loc) => mapBounds.extend([loc.lat, loc.lng]));
      setBounds(mapBounds.pad(0.1));
    } else if (!trip.id) {
      getTrip(id);
    }
  });

  return (
    <Map
      id="mapid"
      bounds={trip.locations && bounds}
      center={!trip.locations && center}
      zoom={13}
      scrollWheelZoom={true}
      ref={mapRef}
    >
      <LayersControl>
        <LayersControl.BaseLayer name="Street">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer checked name="Topo">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors <a href="http://viewfinderpanoramas.org">SRTM</a> | map style: © <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            url="http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <FeatureGroup>
          <EditControl
            ref={editRef}
            position="topright"
            onCreated={_onCreate}
            onEdited={_onEdit}
            onDeleted={_onDelete}
            draw={{
              layers: true,
              rectangle: false,
              polyline: {
                shapeOptions: {
                  color: sport.color,
                },
              },
              circle: false,
              circlemarker: false,
              polygon: false,
              marker: true,
            }}
          />
          {/* add in all of the existing trip legs */}
          {trip.legs
            ? trip.legs.map((leg) => (
                <TripLeg
                  key={leg.id}
                  id={leg.id}
                  sport={leg.sport}
                  locs={trip.locations.filter((loc) => {
                    if (loc.leg_id === leg.id) {
                      return [loc.lat, loc.lng];
                    }
                  })}
                />
              ))
            : null}
        </FeatureGroup>
      </LayersControl>
    </Map>
  );
};
const mapStateToProps = (state) => {
  return {
    trip: state.TripReducer.trip,
  };
};

export default connect(mapStateToProps, {
  deleteLeg,
  addLeg,
  getTrip,
  editLeg,
})(MapContainer);
