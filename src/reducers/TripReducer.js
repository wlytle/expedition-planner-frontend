import { LOAD_TRIP, ALL_TRIPS, UPDATE_LEG } from "../actions/types";

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
    case UPDATE_LEG:
      // update legs of trip
      const trip = { ...state.trip };
      for (let leg in trip.legs) {
        if (leg.id === action.payload.id) {
          leg = action.payload;
        }
      }
      return { ...state, trip };
    default:
      return state;
  }
};

export default TripReducer;
