import {
  LOAD_TRIP,
  ALL_TRIPS,
  INVITES,
  UPDATE_TRIPS,
  DELETE_TRIP,
  SET_TRIP_ID,
  ADD_LEG,
  UPDATE_LEG,
  DELETE_LEG,
  FETCHING,
  ACCEPT_INVITATION,
} from "./types";
import { API } from "../constants";

//Update a leg of the trip
export const updateLeg = (leg) => {
  return { type: UPDATE_LEG, payload: leg };
};

//set up the headers
export const makeHeader = () => {
  const token = localStorage.getItem("jwt");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `bearer ${token}`,
  };
};

//Create a new trip with the current user being added to db as the creator
export const createTrip = (name, start_date, end_date, notes, collabs) => {
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
          notes,
          collabs,
        },
      }),
    })
      .then((r) => r.json())
      .then((trip) => {
        dispatch({ type: FETCHING });
        dispatch({ type: SET_TRIP_ID, payload: trip.id });
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
        // dispatch({ type: INVITES, payload: pending });
      })
      .catch(console.log);
  };
};

//Get all trips with pendign invitiations
export const getInvites = () => {
  return (dispatch) => {
    const headers = makeHeader();

    fetch(API + "/invites", {
      method: "GET",
      headers,
    })
      .then((r) => r.json())
      .then((trips) => {
        dispatch({ type: INVITES, payload: trips });
      })
      .catch(console.log);
  };
};

//Update a trip
export const editTrip = (name, start_date, end_date, notes, completed, id) => {
  return (dispatch) => {
    dispatch({ type: FETCHING });
    const headers = makeHeader();

    fetch(API + "/trips/" + id, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        trip: {
          name,
          start_date,
          end_date,
          notes,
          completed,
        },
      }),
    })
      .then((r) => r.json())
      .then((trip) => {
        dispatch({ type: FETCHING });
        dispatch({ type: UPDATE_TRIPS, payload: trip });
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

//Delete a leg
export const deleteTrip = (trip_id) => {
  return (dispatch) => {
    const headers = makeHeader();
    fetch(API + "/trips/" + trip_id, {
      method: "DELETE",
      headers,
    })
      .then(dispatch({ type: DELETE_TRIP, payload: trip_id }))
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
      .then((data) => {
        const {
          aeg,
          distance,
          id,
          notes,
          sport,
          start_date,
          end_date,
          locations,
        } = data;
        const leg = { id, aeg, distance, notes, sport, start_date, end_date };
        dispatch({ type: ADD_LEG, payload: { leg, locations } });
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
      .then((data) => {
        const { aeg, distance, id, notes, sport, locations } = data;
        const leg = { id, aeg, distance, notes, sport };
        dispatch({ type: UPDATE_LEG, payload: { leg, locations } });
      })
      .catch(console.log);
  };
};

// Edit leg info that is not locations
export const editLegMeta = (leg) => {
  return (dispatch) => {
    dispatch({ type: FETCHING });
    const headers = makeHeader();

    fetch(API + "/legs/meta/" + leg.id, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        leg,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        const { aeg, distance, id, notes, sport, locations } = data;
        const leg = { id, aeg, distance, notes, sport };
        dispatch({ type: UPDATE_LEG, payload: { leg, locations } });
      })
      .catch(console.log);
  };
};

//Delete a leg
export const deleteLeg = (leg_id) => {
  return (dispatch) => {
    const headers = makeHeader();
    fetch(API + "/legs/" + leg_id, {
      method: "DELETE",
      headers,
    })
      .then(dispatch({ type: DELETE_LEG, payload: leg_id }))
      .catch(console.log);
  };
};

//Accept invitation
export const acceptInvitation = (id) => {
  return (dispatch) => {
    const headers = makeHeader();
    fetch(API + "/user_trips/" + id, {
      method: "PATCH",
      headers,
    })
      .then((r) => r.json())
      .then((trip) => dispatch({ type: ACCEPT_INVITATION, payload: trip }))
      .catch(console.log);
  };
};

//Decline invitation
export const declineInvitation = (id) => {
  return (dispatch) => {
    const headers = makeHeader();
    fetch(API + "/user_trips/" + id, {
      method: "PATCH",
      headers,
    })
      .then((r) => r.json())
      .then((trip) => dispatch({ type: ACCEPT_INVITATION, payload: trip }))
      .catch(console.log);
  };
};
