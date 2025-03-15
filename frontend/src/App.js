import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";
import "./App.css";

const PrivateRoute = ({ element }) => {
  return localStorage.getItem("token") ? element : <Navigate to="/login" />;
};

const AuthRoute = ({ element }) => {
  return localStorage.getItem("token") ? <Navigate to="/" /> : element;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/login" element={<AuthRoute element={<Login />} />} />
        <Route path="/register" element={<AuthRoute element={<Register />} />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
