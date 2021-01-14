import { SIGNED_IN } from "../actions/types";

const initialState = {
  user: {},
};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGNED_IN:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export default UserReducer;
