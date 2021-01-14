import React, { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
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
      .then(console.log);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          name="username"
          placeholder="UserName"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="input"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="input"
          type="password"
          name="password_confirmation"
          placeholder="Confirm Password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
        <button className="button" type="submit">
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
