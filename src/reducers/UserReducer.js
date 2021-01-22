import { SIGNED_IN, FETCHING, FAILED_LOGIN, LOG_OUT } from "../actions/types";

const initialState = {
  user: {},
  fetching: false,
  error: "",
};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCHING:
      return { ...state, fetching: !state.fetching };
    case SIGNED_IN:
      console.log(action.payload);
      return { ...state, user: action.payload, fetching: false, error: "" };
    case FAILED_LOGIN:
      return { ...state, error: action.payload, fetching: false };
    case LOG_OUT:
      return { ...state, user: {} };
    default:
      return state;
  }
};

export default UserReducer;
