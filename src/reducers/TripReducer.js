import { LOAD_TRIP } from "../actions/types";

const initialState = {
  trip: {},
};

const TripReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_TRIP:
      return { ...state, trip: action.payload };
    default:
      return state;
  }
};

export default TripReducer;
