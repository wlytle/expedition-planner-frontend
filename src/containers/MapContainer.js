import React, { useState, useRef } from "react";
import { TileLayer, Map, FeatureGroup, LayersControl } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

const MapContainer = () => {
  const center = [34, -110.0];

  const [mapLayers, setMapLayers] = useState([]);
  const [track, setTrack] = useState([]);
  const [sport, setSport] = useState({ sport: "hike", color: "teal" });

  const editRef = useRef();

  const _onCreate = (e) => {
    console.log(e);
    onShapeDrawn(e);
    const { layerType, layer } = e;
    if (layerType == "marker") {
      debugger;
    }
    if (layerType === "polyline") {
      const { _leaflet_id } = layer;
      setMapLayers((layers) => [
        ...layers,
        { id: _leaflet_id, sport: sport.sport, latlngs: layer.getLatLngs() },
      ]);
      setTrack(e.layer._latlngs);
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
        </FeatureGroup>
      </LayersControl>
    </Map>
  );
};

export default MapContainer;
