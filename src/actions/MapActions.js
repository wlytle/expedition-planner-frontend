import { TOGGLE_PANE, OPEN_PANE } from "./types";

//Update a leg of the trip
export const togglePane = () => {
  return { type: TOGGLE_PANE };
};

//Update a leg of the trip
export const openPane = (leg) => {
  return { type: OPEN_PANE, payload: leg };
};
