import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="navbar">
      <span>Welcome, {user?.name || "Admin"}</span>
      <button onClick={logout}>Logout</button>
    </header>
  );
};

export default Navbar;
