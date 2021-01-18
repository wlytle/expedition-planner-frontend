import { LOAD_TRIP, ALL_TRIPS, UPDATE_LEG, FETCHING } from "./types";
import { API } from "../constants";

//Update a leg of the trip
export const updateLeg = (leg) => {
  return { type: UPDATE_LEG, payload: leg };
};

//set up the headers
const makeHeader = () => {
  const token = localStorage.getItem("jwt");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `bearer ${token}`,
  };
};

//Create a new trip with the current user being added to db as the creator
export const createTrip = (name, start_date, end_date) => {
  return (dispatch) => {
    dispatch({ type: FETCHING });
    const headers = makeHeader();

    fetch(API + "/trips", {
      method: "POST",
      headers,
      body: JSON.stringify({
        trip: {
          name,
          start_date,
          end_date,
        },
      }),
    })
      .then((r) => r.json())
      .then((trip) => {
        dispatch({ type: FETCHING });
        dispatch({ type: LOAD_TRIP, payload: trip });
      })
      .catch(console.log);
  };
};

// Get all trips asociated with a user and add them to state
export const getTrips = () => {
  return (dispatch) => {
    const headers = makeHeader();

    fetch(API + "/trips", {
      method: "GET",
      headers,
    })
      .then((r) => r.json())
      .then((trips) => {
        dispatch({ type: ALL_TRIPS, payload: trips });
      })
      .catch(console.log);
  };
};

// Get a sepcific trip and load it into state
export const getTrip = (id) => {
  return (dispatch) => {
    const headers = makeHeader();

    fetch(API + "/trips/" + id, {
      method: "GET",
      headers,
    })
      .then((r) => r.json())
      .then((trip) => {
        console.log(trip);
        dispatch({ type: LOAD_TRIP, payload: trip });
      })
      .catch(console.log);
  };
};

// Get all trips asociated with a user and add them to state
export const addLeg = (id, leg) => {
  return (dispatch) => {
    const headers = makeHeader();

    fetch(API + "/legs", {
      method: "POST",
      headers,
      body: JSON.stringify({
        trip_id: id,
        sport: leg.sport,
        locs: leg.latlngs,
        distance: leg.distance,
      }),
    })
      .then((r) => r.json())
      .then((leg) => {
        console.log(leg);
      })
      .catch(console.log);
  };
};

// Get all trips asociated with a user and add them to state
export const editLeg = (leg_id, locs, distance) => {
  return (dispatch) => {
    const headers = makeHeader();

    fetch(API + "/legs/" + leg_id, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        leg_id,
        locs,
        distance,
      }),
    })
      .then((r) => r.json())
      .then((leg) => {
        console.log(leg);
        updateLeg(leg);
      })
      .catch(console.log);
  };
};
