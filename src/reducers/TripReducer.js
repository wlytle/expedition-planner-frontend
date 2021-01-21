import {
  LOAD_TRIP,
  ALL_TRIPS,
  DELETE_TRIP,
  UPDATE_TRIPS,
  ADD_LEG,
  UPDATE_LEG,
  DELETE_LEG,
} from "../actions/types";

const initialState = {
  trip: { legs: [] },
  allTrips: [],
};

let newLegs, newLocs, newTrips;
const TripReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_TRIP:
      return { ...state, trip: action.payload };
    case ALL_TRIPS:
      return { ...state, allTrips: action.payload };
    case UPDATE_TRIPS:
      //replace the updated trip with older version
      newTrips = state.allTrips.filter((trip) => trip.id !== action.payload.id);
      newTrips.push(action.payload);
      newTrips.sort((a, b) => a.id - b.id);
      return { ...state, allTrips: newTrips };
    // delete a trip
    case DELETE_TRIP:
      // Remove deleted leg of trip from state
      newTrips = state.allTrips.filter((t) => t.id !== action.payload);
      return {
        ...state,
        allTrips: newTrips,
      };
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
      newLegs = state.trip.legs.filter((l) => l.id !== leg.id).push(leg);
      const temp = state.trip.locations.filter((loc) => loc.leg_id !== leg.id);
      newLocs = [...temp, ...locations];
      return { ...state, trip: action.payload };
    case DELETE_LEG:
      // Remove deleted leg of trip from state
      newLegs = state.trip.legs.filter((l) => l.id !== action.payload);
      newLocs = state.trip.locations.filter(
        (loc) => loc.leg_id !== action.payload
      );
      return {
        ...state,
        trip: { ...state.trip, legs: newLegs, lcoations: newLocs },
      };
    default:
      return state;
  }
};

export default TripReducer;
