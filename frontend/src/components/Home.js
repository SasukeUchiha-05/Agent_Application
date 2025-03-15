import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [message, setMessage] = useState("Checking authentication...");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    axios
      .get("http://localhost:3001/auth/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setMessage(res.data.message))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login"); // Redirect to login on invalid token
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    navigate("/logout"); // Redirect to logout route
  };

  return (
    <div className="container">
      <button className="logout" onClick={handleLogout}>Logout</button>
      <h1>{message}</h1>
    </div>
  );
};

export default Home;
//haha
