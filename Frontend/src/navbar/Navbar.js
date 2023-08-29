import React from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem('user');

  const logOutHandler = async () => {
    localStorage.clear();
    navigate('/login');
    return;
  }

  return (
    <nav className="navbar">
      <div className="navbar-links">
        {/* <NavLink to="/">Main</NavLink> */}
        <NavLink to="/"> MY TO-DO</NavLink>
      </div>
      <div className="navbar-auth">
        {user ? <NavLink onClick={() => { logOutHandler() }}>LogOut</NavLink> :
          <><NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Signup</NavLink></>
        }
      </div>
    </nav>
  );
};

export default Navbar;