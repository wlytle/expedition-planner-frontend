import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (user) return null;
    const token = localStorage.getItem("jwt");
    fetch("http://localhost:3000/users", {
      method: "GET",
      headers: {
        Authorization: `bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((user) => {
        setUser(user);
        console.log(user);
      })
      .catch(console.log);
  });

  return (
    <div>
      <h1>{"Profile"}</h1>
    </div>
  );
};

export default Profile;
