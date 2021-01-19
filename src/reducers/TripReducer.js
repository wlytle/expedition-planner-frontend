import {
  LOAD_TRIP,
  ALL_TRIPS,
  ADD_LEG,
  UPDATE_LEG,
  DELETE_LEG,
} from "../actions/types";

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
    case ADD_LEG:
      // Push newly created leg into the trip legs array
      //Seriously though come back and refactor this to have a trip reducer and a elg reducer and a location reducer to avoid this avoiding mutation madness
      return {
        ...state,
        trip: {
          ...state.trip,
          legs: [...state.trip.legs, action.payload.leg],
          locations: [...state.trip.locations, ...action.payload.locations],
        },
      };
    case UPDATE_LEG:
      const { leg, locations } = action.payload;
      const newLegs = state.trip.legs.filter((l) => l.id !== leg.id).push(leg);
      const temp = state.trip.locations.filter((loc) => loc.leg_id !== leg.id);
      const newLocs = [...temp, locations];
      return { ...state, trip: action.payload };
    case DELETE_LEG:
      // Remove deleted leg of trip from state
      trip = { ...state.trip };
      trip.legs.filter((leg) => leg.id !== action.payload);
      return {
        ...state,
        trip: { ...state.trip },
        legs: newLegs,
        locations: newLocs,
      };
    default:
      return state;
  }
};

export default TripReducer;
