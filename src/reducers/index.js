import { combineReducers } from "redux";
import TripReducer from "./TripReducer";
import UserReducer from "./UserReducer";
import MapReducer from "./MapReducer";

export default combineReducers({
  TripReducer,
  UserReducer,
  MapReducer,
});
