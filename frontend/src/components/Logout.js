import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token"); // Remove JWT token
    navigate("/login"); // Redirect to login
  }, [navigate]);

  return null; // No UI needed, just performs logout
};

export default Logout;
