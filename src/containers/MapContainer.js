import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { TileLayer, Map, FeatureGroup, LayersControl } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { addLeg, getTrip, editLeg, deleteLeg } from "../actions/TripActions";
import TripLeg from "../components/TripLeg";

const MapContainer = ({ addLeg, getTrip, trip, editLeg, deleteLeg }) => {
  const center = [34, -110.0];

  const [mapLayers, setMapLayers] = useState([]);
  const [track, setTrack] = useState([]);
  const [sport, setSport] = useState({ sport: "hike", color: "teal" });

  const editRef = useRef();

  let { id } = useParams();

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
      const { _leaflet_id } = layer;
      // calculate distance of polyline
      const distance = getDistance(layer.getLatLngs());
      setMapLayers((layers) => [
        ...layers,
        { id: _leaflet_id, sport: sport.sport, latlngs: layer.getLatLngs() },
      ]);
      setTrack(e.layer._latlngs);
      addLeg(id, {
        sport: sport.sport,
        latlngs: layer.getLatLngs(),
        distance,
      });
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
    if (trip.id) return;
    getTrip(id);
  });

  return (
    <Map id="mapid" center={center} zoom={13} scrollWheelZoom={true}>
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
                  editRef={editRef}
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
