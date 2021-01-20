import React, { useState, useRef, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import L, { latLngBounds } from "leaflet";
import { TileLayer, Map, FeatureGroup, LayersControl } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { addLeg, getTrip, editLeg, deleteLeg } from "../actions/TripActions";
import TripLeg from "../components/TripLeg";
import LegForm from "..//components/LegForm";

const MapContainer = ({ trip, addLeg, getTrip, editLeg, deleteLeg }) => {
  const [sport, setSport] = useState({ sport: "hike", color: "teal" });
  const [open, setOpen] = useState(false);
  const [noEdit, setNoEdit] = useState(false);
  // initialize ref to edit controls
  const editRef = useRef();
  const mapRef = useRef();
  const boundsRef = useRef();
  const centerRef = useRef();
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
  const c = [34, -110.0];

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
      //update track in the backend and re-render the updated trip
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

  const handleOnLocationFound = (e) => {
    const { current = {} } = mapRef;
    const { leafletElement: map } = current;
    const latlng = e.latlng;
    centerRef.current = [latlng.lat, latlng.lng];
    console.log("center", centerRef.current);
    const radius = e.accuracy;
    const circle = L.circle(latlng, radius);
    circle.addTo(map);
  };

  const getMapLoc = async (map) => {
    await map.locate();
  };

  const toggleEdit = () => {
    // Dont open the model if the delete button is currently selected
    if (
      editRef.current.leafletElement._toolbars.edit._modes.remove.handler.enabled()
    )
      return;
    setOpen(true);
  };
  // Reload current trip from database incase of page load
  useEffect(() => {
    console.log(trip, boundsRef.current);
    if (trip.id && !boundsRef.current) {
      // if a trip is loaded into state app state and componenet state has no bounds, get the bounds
      const mapBounds = latLngBounds();
      trip.locations.forEach((loc) => mapBounds.extend([loc.lat, loc.lng]));
      // if there are legs to get bounds from set them in state
      console.log(mapBounds);
      if (mapBounds._southWest)
        localStorage.setItem("bounds", mapBounds.pad(0.1));
    } else if (!trip.id) {
      // debugger;
      // destructre map oiut of ref
      const { current = {} } = mapRef;
      const { leafletElement: map } = current;
      //get lcoation of browser
      getMapLoc(map);
      //set center and add circle with accuracy radius
      map.on("locationfound", handleOnLocationFound);
      // get the current trip from the backend and load it into app state
      getTrip(id);
    }
  });

  return (
    <>
      <SlidingPane
        closeIcon={<div>X</div>}
        isOpen={open}
        title="Hey, it is optional pane title.  I can be React component too."
        from="left"
        width="400px"
        className="pane-overlay"
        onRequestClose={() => setOpen(false)}
      >
        <LegForm />
      </SlidingPane>
      <Map
        id="mapid"
        className={open ? "map-respond" : "map"}
        ref={mapRef}
        bounds={trip.locations && boundsRef.current}
        // center={!trip.locations && centerRef.current}
        // center={!trip.locations && centerRef.current ? centerRef.current : c}
        center={!trip.locations && c}
        zoom={13}
        scrollWheelZoom={true}
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
              onClick={(e) => console.log(e)}
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
                    toggleEdit={toggleEdit}
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
      <button onClick={() => setOpen(true)}>do the thing</button>
    </>
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
