import { LOAD_TRIP, ALL_TRIPS } from "../actions/types";

const initialState = {
  trip: {},
  allTrips: [],
};

const TripReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_TRIP:
      return { ...state, trip: action.payload };
    case ALL_TRIPS:
      return { ...state, allTrips: action.payload };
    default:
      return state;
  }
};

export default TripReducer;
