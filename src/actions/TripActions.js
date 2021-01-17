import { LOAD_TRIP, FETCHING } from "./types";
import { API } from "../constants";

export const createTrip = (user, name, start_date, end_date) => {
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
