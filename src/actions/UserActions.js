import { FETCHING, SIGNED_IN, FAILED_LOGIN } from "./types";

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
          password: password,
        },
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          const { user } = data;
          localStorage.setItem("jwt", user.jwt);
          localStorage.setItem("user", user);
          dispatch({
            type: SIGNED_IN,
            payload: user,
          });
        } else {
          dispatch({
            type: FAILED_LOGIN,
            payload: data.error,
          });
        }
      })
      .catch((e) => console.log(e));
  };
};

// create a new user account
export const signUp = (username, password) => {
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
          password: password,
        },
      }),
    })
      .then((r) => r.json())
      .then((user) => {
        localStorage.setItem("jwt", user.jwt);
        localStorage.setItem("user", user);
        dispatch({
          type: SIGNED_IN,
          payload: user.user,
        });
      });
  };
};

// Edit User
export const editUser = (id, username, password) => {
  console.log("EDITING");
  return (dispatch) => {
    dispatch({ type: FETCHING });
    const token = localStorage.getItem("jwt");
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
          password: password,
        },
      }),
    })
      .then((r) => r.json())
      .then((user) => {
        localStorage.setItem("jwt", user.jwt);
        localStorage.setItem("user", user);
        signedIn(user);
      });
  };
};

// put signed in user into state
export const signedIn = (user) => {
  return { type: SIGNED_IN, payload: user };
};
