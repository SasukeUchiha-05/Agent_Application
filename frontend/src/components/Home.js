import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaRobot } from "react-icons/fa"; 
import "./CSS/Home.css";

const Home = () => {
  const [message, setMessage] = useState("Checking authentication...");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login"); 
      return;
    }

    axios
      .get("http://localhost:3001/auth/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setMessage(res.data.message))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login"); 
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/logout"); 
  };

  const goToAgent = () => {
    navigate("/agent"); 
  };

  return (
    <div className="container">
      <button className="logout" onClick={handleLogout}>Logout</button>
      <h1>{message}</h1>

      <button className="agent-icon" onClick={goToAgent} title="Chat with AI">
        <FaRobot size={40} color="#4CAF50" />
      </button>
    </div>
  );
};

export default Home;
