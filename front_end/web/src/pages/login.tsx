import React, { useState } from "react";
import InputField from "../components/inputfield";
import Button from "../components/button";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    alert(`Username: ${username}\nPassword: ${password}`);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Login</h2>
      <InputField label="Username" value={username} onChange={setUsername} />
      <InputField label="Password" type="password" value={password} onChange={setPassword} />
      <Button text="Se connecter" onClick={handleLogin} />
    </div>
  );
}
