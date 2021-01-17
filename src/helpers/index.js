import { connect } from "react-redux";
import { failedAuth } from "../actions/UserActions";

//Set form error messages and send a flag for which fields raised errors
export const validateForm = (
  username,
  password,
  passwordConfirmation = null,
  failedAuth
) => {
  switch (true) {
    case username === "" || password === "" || passwordConfirmation === "":
      failedAuth("All fields are required");
      return { all: true };
    case password !== passwordConfirmation:
      failedAuth("Passwords must match");
      return { password: true };
    default:
      return { none: true };
  }
};

export default connect(null, { failedAuth })(validateForm);
