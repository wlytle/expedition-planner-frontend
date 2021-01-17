import { LOAD_TRIP, ALL_TRIPS, FETCHING } from "./types";
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

// GEt all trips asociated with a user and add them to state
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
        console.log(trips);
        dispatch({ type: ALL_TRIPS, payload: trips });
      })
      .catch(console.log);
  };
};
