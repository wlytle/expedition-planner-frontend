import { LOAD_TRIP, ALL_TRIPS, UPDATE_LEG, DELETE_LEG } from "../actions/types";

const initialState = {
  trip: {},
  allTrips: [],
};

let trip;
const TripReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_TRIP:
      return { ...state, trip: action.payload };
    case ALL_TRIPS:
      return { ...state, allTrips: action.payload };
    case UPDATE_LEG:
      // update legs of trip
      trip = { ...state.trip };
      for (let leg in trip.legs) {
        if (leg.id === action.payload.id) {
          leg = action.payload;
        }
      }
      return { ...state, trip };
    case DELETE_LEG:
      // Remove deleted leg of trip from state
      trip = { ...state.trip };
      trip.legs.filter((leg) => leg.id !== action.payload);
      return { ...state, allTrips: action.payload };
    default:
      return state;
  }
};

export default TripReducer;
