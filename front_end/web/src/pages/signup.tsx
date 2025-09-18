import React, { useState } from "react";
import InputField from "../components/inputfield";
import Button from "../components/button";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }
    alert(`Utilisateur créé !\nUsername: ${username}\nEmail: ${email}`);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Signup</h2>
      <InputField label="Username" value={username} onChange={setUsername} />
      <InputField label="Email" type="email" value={email} onChange={setEmail} />
      <InputField label="Password" type="password" value={password} onChange={setPassword} />
      <InputField label="Confirm Password" type="password" value={confirmPassword} onChange={setConfirmPassword} />
      <Button text="S'inscrire" onClick={handleSignup} />
    </div>
  );
}
