import { TOGGLE_PANE, OPEN_PANE, ANIMATE_PANE } from "../actions/types";

const initialState = {
  center: [],
  bounds: {},
  pane: false,
  selectedLeg: {},
  animate: false,
};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_PANE:
      return { ...state, pane: !state.pane };
    case OPEN_PANE:
      return { ...state, pane: true, selectedLeg: action.payload };
    case ANIMATE_PANE:
      return { ...state, animate: !state.animate };
    default:
      return state;
  }
};

export default UserReducer;
