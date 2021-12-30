//Module Imports
import React, { useState, useEffect } from "react";

//File Imports (CSS/Images)
import logo from "../assets/reddit.png";

//Creating Component
const Header = () => {

  //Checking if logged in or not using localStorage values
  var login;
  try {
    var userData = localStorage.getItem("userInfo"); //get user data
    var token = localStorage.getItem("token"); //get token

    var userJsonData = JSON.parse(userData); //converting user data string to JSON object
    var role = userJsonData.fk_user_type_id; //attempting to extract user type id from converted user data JSON object
    console.log("Logged in");
    login = true;
  } catch (error) { // error occurs when user data JSON is undefined and extraction of user type id fails.
    console.log("Not logged in");
    login = false;
  }

  //Dynamic header buttons for Logging In and Signing Up (not logged in)/ Viewing Profile or Logging Out (logged in)
  function createHeaderUserButtons() {
    if (!login) { //If not logged in, return login and sign up button
      return (
        <ul className="navbar-nav ms-auto">
          <a href="/login.html" id="loginButton" className="btn me-2 px-4 rounded-pill"> 
            Login
          </a>
          <a href="/addUser.html" id="signUpButton" className="btn me-3 px-4">
            Sign Up
          </a>
        </ul>
      );
    } else { // if logged in, return profile and log out button
      return (
        <ul className="navbar-nav ms-auto">
          <a href="/profile" id="profileButton" className="btn me-2 px-4 rounded-pill ">
            Profile
          </a>
          <a href="/login.html" onClick={() => localStorage.clear()} id="signUpButton" className="btn me-3 px-4">
            Log Out
          </a>
        </ul>
      );
    }
  }

  //Function that redirects to search page
  let runSearch = (e) => {
    e.preventDefault();
    var query = document.getElementById("Search").value; //getting value of text entered into search bar
    window.location.href = "/search.html?query=" + query; //redirecting user to the search page
  };

  //Rendering the Header
  return (
    <React.Fragment>
      <nav className="navbar navbar-dark navbar-expand-lg" id="header"> 
        <div className=" container-fluid">
          <a className="navbar-brand" href="/">
            <img src={logo} alt="" width="30" height="30" className="d-inline-block align-text-top me-1" />
            Readdit
          </a>
          <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#readitNavbar" aria-controls="readitNavbar" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div id="readitNavbar" className="collapse navbar-collapse">
            <form className="flex-grow-1 me-5 ms-5 mb-0" onSubmit={runSearch}>
              <div className="input-group">
                <input className="form-control bg-light h-100" type="text" placeholder="Search for Post / Subreadit" aria-label="Search" id="Search" />
                <button className="btn bg-white" type="submit" id="headerSearchBtn" onClick={() => runSearch}>
                  <i className="fas fa-search text-white"></i>
                </button>
              </div>
            </form>
            {createHeaderUserButtons()}
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default Header;
