import { SIGNING_IN, SIGNED_IN } from "./types";

export const signIn = (username, password) => {
  return (dispatch) => {
    dispatch({ type: SIGNING_IN });
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
      .then((user) => {
        console.log(user);
        localStorage.setItem("jwt", user.jwt);
        localStorage.setItem("user", user);
        dispatch({
          type: SIGNED_IN,
          payload: user.user,
        });
      })
      .catch((e) => console.log(e));
  };
};

export const signUp = (username, password) => {
  return (dispatch) => {
    dispatch({ type: SIGNING_IN });
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

export const signedIn = (user) => {
  return { type: SIGNED_IN, payload: user };
};
