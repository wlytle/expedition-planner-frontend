import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { TileLayer, Map, FeatureGroup, LayersControl } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { addLeg, getTrip } from "../actions/TripActions";
import TripLeg from "../components/TripLeg";

const MapContainer = ({ addLeg, getTrip, trip }) => {
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

  const _onCreate = (e) => {
    console.log(e);
    onShapeDrawn(e);
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
        id: _leaflet_id,
        sport: sport.sport,
        latlngs: layer.getLatLngs(),
        distance,
      });
    }
  };

  const onShapeDrawn = (e) => {
    e.layer.on("click", () => {
      debugger;
      editRef.current.leafletElement._toolbars.edit._modes.edit.handler.enable();
    });
    e.layer.on("contextmenu", () => {
      console.log("You right clicked!");
    });
    e.layer.bindTooltip("Text", {
      className:
        "leaflet-draw-tooltip:before leaflet-draw-tooltip leaflet-draw-tooltip-visible",
      sticky: true,
      direction: "right",
    });
  };

  const _onEdit = (e) => {
    console.log(e);
    const {
      layers: { _layers },
    } = e;
    Object.values(_layers).map(({ _leaflet_id, editing }) => {
      setMapLayers((layers) =>
        layers.map((l) =>
          l.id === _leaflet_id
            ? { ...l, latlngs: { ...editing.latlngs[0] } }
            : l
        )
      );
    });
  };
  const _onDelete = (e) => {
    console.log(e);
    const {
      layers: { _layers },
    } = e;
    Object.values(_layers).map((_leaflet_id) => {
      setMapLayers((layers) => layers.filter((l) => l.id !== _leaflet_id));
    });
  };

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

export default connect(mapStateToProps, { addLeg, getTrip })(MapContainer);
