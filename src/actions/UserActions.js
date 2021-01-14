import { SIGNED_IN } from "./types";

export const signedIn = (user) => {
  return {
    type: SIGNED_IN,
    payload: user,
  };
};
