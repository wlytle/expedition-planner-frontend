import React from "react";
import { connect } from "react-redux";
import EleChart from "../components/EleChart";

function EleContainer({ map, trip, setBlip }) {
  //   useEffect(() => {
  //     const chartData = getData();
  //   });

  const getData = () => {
    let data = [];
    let locs, legId, leg, ele;
    const layers = map.current.leafletElement._layers;
    //itereate through all map layers
    for (const layer in layers) {
      //only move forward with map layers that have location data
      if (layers[layer].getLatLngs) {
        locs = layers[layer].getLatLngs();
        // get the locations for each layer and find the leg it's associated with.
        legId = trip.locations.find(
          (loc) => locs[0].lat === loc.lat && locs[0].lng === loc.lng
        ).leg_id;
        // get the leg associated witht eh layer to get all the metadata
        leg = trip.legs.find((l) => l.id === legId);
        ele = trip.locations.filter((loc) => loc.leg_id === leg.id);
        leg.elevations = ele;
        data.push({ leg, locs });
      }
    }
    // sort the data by leg start date
    data.sort(
      (a, b) => new Date(a.leg.start_date) - new Date(b.leg.start_date)
    );
    return getDistance(data);
  };

  const getDistance = (data) => {
    let chartData = [];
    for (let i = 0; i < data.length; i++) {
      let curr = data[i];
      for (let j = 0; j < curr.locs.length; j++) {
        let ele = curr.leg.elevations[j].ele;
        let distance;
        // get the distance between each data point
        if (i === 0 && j === 0) {
          // first loc of a trip distance  is 0
          distance = 0;
        } else if (j === 0) {
          // first loc of leg that is not the first leg is distance form that point to the last point of the previous leg
          distance = curr.locs[j].distanceTo(
            data[i - 1].locs[data[i - 1].locs.length - 1]
          );
          distance =
            +(distance / 1000).toFixed(2) +
            chartData[chartData.length - 1].label;
        } else {
          distance = curr.locs[j].distanceTo(curr.locs[j - 1]);

          distance =
            +(distance / 1000).toFixed(2) +
            chartData[chartData.length - 1].label;
        }
        // convert distance to km and convert each point to cummulitive distance froms start
        chartData.push({
          label: distance,
          value: ele,
          tooltipContent: `<b>Distance: </b>${distance} km<br><b>Elevation: </b>${ele} m`,
          locs: curr.locs[j],
        });
      }
    }

    return chartData;
  };

  // send our data to a function to render the chart
  const chartData = getData();
  console.log(chartData);
  return (
    <div className="ele">
      {chartData?.length ? (
        <EleChart data={chartData} setBlip={setBlip} width={400} height={200} />
      ) : null}
    </div>
  );
}

export default connect((state) => ({ trip: state.TripReducer.trip }))(
  EleContainer
);
