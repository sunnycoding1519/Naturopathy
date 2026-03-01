import "./Login.css";
import { useState } from "react";
import API from "../api";

export default function Login(){

  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");

  const login = async () => {

    try{
      const res = await API.post("/login",{
        username,
        password
      });

      // save token
      localStorage.setItem("token", res.data.token);

      alert("Login Successful ✅");

      // ✅ IMPORTANT FIX (reload page so token attach ho)
      window.location.href = "/admin";

    }catch{
      alert("Wrong Username or Password");
    }
  };

  return(
    <div className="login-container">
      <div className="login-box">

        <h2>Admin Login</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={e=>setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>

      </div>
    </div>
  );
}