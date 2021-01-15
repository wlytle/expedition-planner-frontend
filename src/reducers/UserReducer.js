import { SIGNED_IN, SIGNING_IN } from "../actions/types";

const initialState = {
  user: {},
  fetching: false,
};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGNING_IN:
      return { ...state, fetching: true };
    case SIGNED_IN:
      return { ...state, user: action.payload, fetching: false };
    default:
      return state;
  }
};

export default UserReducer;
