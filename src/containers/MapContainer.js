import React, { useRef, useEffect, useState } from "react";
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
import { togglePane, openPane } from "../actions/MapActions";
import TripLeg from "../components/TripLeg";
import LegForm from "..//components/LegForm";

const MapContainer = ({
  trip,
  pane,
  selectedLeg,
  addLeg,
  getTrip,
  editLeg,
  deleteLeg,
  togglePane,
  openPane,
}) => {
  // initialize ref to edit controls
  const editRef = useRef();
  const mapRef = useRef();
  const centerRef = useRef();

  const [bounds, setBounds] = useState(false);

  // Get id of trip from route
  let { id } = useParams();

  //set temporary default cetner at Upset Rapid
  const c = [36.355308, -112.695433];

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
        sport: "Hike",
        latlngs: layer.getLatLngs(),
        distance,
      });
      //remove the layer from the drawn functional group it will be rerendered from state to allow fo identical access controls for all paaths newly created and laoded in
      const fg = editRef.current.leafletElement.options.edit.featureGroup;
      fg.removeLayer(fg._layers[e.layer._leaflet_id]);
    }
  };

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

  // fly map to current lcoation and add circle showing accuracy of location
  const handleOnLocationFound = (e) => {
    const { current = {} } = mapRef;
    const { leafletElement: map } = current;
    const latlng = e.latlng;
    centerRef.current = latlng;
    map.flyTo(latlng, 14, { duration: 2 });
    const radius = e.accuracy;
    const circle = L.circle(latlng, radius);
    circle.addTo(map);
  };

  const getMapLoc = async (map) => {
    await map.locate();
  };

  const toggleEdit = (e) => {
    // Dont open the edit pane if the delete button is currently selected
    if (
      editRef.current.leafletElement._toolbars.edit._modes.remove.handler.enabled()
    )
      return;
    const leg = trip.legs.find((leg) => leg.id === e.target.options.legId);
    openPane(leg);
  };

  //close edit pane on close button click
  const closePane = () => {
    togglePane();
  };

  // Reload current trip from database incase of page load
  useEffect(() => {
    if (trip.id && !bounds && !centerRef.current) {
      // if a trip is loaded into state app state and componenet state has no bounds, get the bounds
      if (trip?.locations?.length) {
        const mapBounds = latLngBounds();
        trip.locations.forEach((loc) => mapBounds.extend([loc.lat, loc.lng]));
        // if there are legs to get bounds from set them in state
        setBounds(mapBounds.pad(0.1));
      } else if (mapRef.current) {
        const { current = {} } = mapRef;
        const { leafletElement: map } = current;
        //Get current location if no legs yet and fly screen there.
        getMapLoc(map);
        map.on("locationfound", handleOnLocationFound);
      }
    } else if (!trip.id) {
      // load trip into state if it's not there yet
      getTrip(id);
    }
  });

  console.log(trip?.locations?.length, trip);
  return (
    <>
      <SlidingPane
        closeIcon={<p>X</p>}
        isOpen={pane}
        title={`Distance: ${(selectedLeg.distance / 1000).toFixed(2)} km AEG: ${
          selectedLeg.aeg
        } m`}
        from="left"
        width="400px"
        className="pane-overlay"
        onRequestClose={() => closePane()}
      >
        <LegForm leg={selectedLeg} />
      </SlidingPane>
      <Map
        id="mapid"
        className={pane ? "map-respond" : "map"}
        ref={mapRef}
        bounds={trip?.locations?.length && bounds}
        // center={!trip.locations && center}
        // center={!trip.locations && centerRef.current ? centerRef.current : c}
        center={c}
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
                    color: "red",
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
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    trip: state.TripReducer.trip,
    pane: state.MapReducer.pane,
    selectedLeg: state.MapReducer.selectedLeg,
  };
};

export default connect(mapStateToProps, {
  deleteLeg,
  addLeg,
  getTrip,
  editLeg,
  togglePane,
  openPane,
})(MapContainer);
