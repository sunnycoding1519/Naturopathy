import "./Login.css";
import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Login(){

  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const navigate = useNavigate();

  const login=()=>{

    API.post("/login",{
      username,
      password
    })
    .then(res=>{
      localStorage.setItem("token",res.data.token);
      navigate("/admin");
    })
    .catch(()=>{
      alert("Wrong Username or Password");
    });
  };

  return(
    <div className="login-container">

      <div className="login-box">
        <h2>Admin Login</h2>

        <input
          placeholder="Username"
          onChange={e=>setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e=>setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>
      </div>

    </div>
  );
}