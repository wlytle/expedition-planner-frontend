import { combineReducers } from "redux";
import maps from "./maps";
import UserReducer from "./UserReducer";

export default combineReducers({
  maps,
  UserReducer,
});
