import { LOAD_TRIP, ALL_TRIPS, ADD_LEG, FETCHING } from "./types";
import { API } from "../constants";

//Create a new trip with the current user being added to db as the creator
export const createTrip = (name, start_date, end_date) => {
  return (dispatch) => {
    dispatch({ type: FETCHING });
    const token = localStorage.getItem("jwt");

    fetch(API + "/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `bearer ${token}`,
      },
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
    const token = localStorage.getItem("jwt");

    fetch(API + "/trips", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `bearer ${token}`,
      },
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
    const token = localStorage.getItem("jwt");

    fetch(API + "/trips/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `bearer ${token}`,
      },
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
    const token = localStorage.getItem("jwt");

    fetch(API + "/legs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `bearer ${token}`,
      },
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
