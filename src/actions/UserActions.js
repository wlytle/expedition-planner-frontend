import { FETCHING, SIGNED_IN, FAILED_LOGIN } from "./types";

// put signed in user into state
export const signedIn = (user) => {
  return { type: SIGNED_IN, payload: user };
};

//set Error message on failed auth
export const failedAuth = (error) => {
  console.log("FAiled Auth!", error);
  return { type: FAILED_LOGIN, payload: error };
};

//helper function for dispatching actions based on user auth return
const handleAuthReturn = (data, dispatch) => {
  if (data.user) {
    const { user } = data;

    localStorage.setItem("jwt", data.jwt);
    localStorage.setItem("username", user.user_name);
    localStorage.setItem("userId", user.id);
    //set the user in state
    dispatch(signedIn({ id: user.id, username: user.user_name }));
  } else {
    //set an error message in state
    dispatch(failedAuth(data.error));
  }
};

//Sign a user in
export const signIn = (username, password) => {
  return (dispatch) => {
    dispatch({ type: FETCHING });
    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        auth: {
          user_name: username,
          password,
        },
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        handleAuthReturn(data, dispatch);
      })
      .catch((e) => console.log(e));
  };
};

// create a new user account
export const signUp = (username, password, passwordConfirmation) => {
  return (dispatch) => {
    dispatch({ type: FETCHING });
    fetch("http://localhost:3000/users", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        user: {
          user_name: username,
          password,
          password_confirmation: passwordConfirmation,
        },
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        handleAuthReturn(data, dispatch);
      })
      .catch((e) => console.log(e));
  };
};

// Edit User
export const editUser = (id, username, password, passwordConfirmartion) => {
  console.log("EDITING");
  return (dispatch) => {
    dispatch({ type: FETCHING });
    const token = localStorage.getItem("jwt");
    console.log(token);
    fetch(`http://localhost:3000/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify({
        user: {
          user_name: username,
          password,
          password_confirmation: passwordConfirmartion,
        },
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        handleAuthReturn(data, dispatch);
      })
      .catch((e) => console.log(e));
  };
};
