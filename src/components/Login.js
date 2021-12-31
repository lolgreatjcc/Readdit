// Module Imports
import React from "react";
import axios from "axios"; //npm i axios
//import { toast } from "wc-toast"; //npm i wc-toast
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//File Imports (CSS/Images)
import "../css/color_scheme.css";
import "../css/create_form.css";

//Component Creation
const Login = () => {
  //Defining States
  const baseUrl = [process.env.REACT_APP_BASEURL1, process.env.REACT_APP_BASEURL2];

  function login() {
    const url = `https://readdit-backend.herokuapp.com/api/login`;

    let email = document.getElementById("email").value;
    let pwd = document.getElementById("pwd").value;

    let data = {
      email: email,
      password: pwd
    };

    axios
      .post(url, data)
      .then((data) => {
        if (data != null) {
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('userInfo', data.data.UserData);
          toast.success("Logging In...");
          window.location.assign(`${baseUrl[1]}/home.html`);
        } else {
          console.log("Unknown error occured!");
          toast.error("Unknown error occured!");
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        console.log(err.response.data.message);
      });
  }

  return (
    <React.Fragment>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick limit={3} transition={Slide} rtl={false} theme="dark" pauseOnFocusLoss draggable pauseOnHover />
      {/* <wc-toast></wc-toast> */}
      <div className="container-xxl my-md-2">
        <div className="row">
          <div className="col-lg-2"></div>
          <div className="col-lg-8">
            <div className="container-fluid">
              <div className="row rounded shadow" id="createUserImage">
                <div className="col-2"></div>
                <div className="col-7 bg-white p-5">
                  <h5 className="fw-bold">Log In</h5>
                  <p className="smaller">By continuing, you are agreeing to Readdit's <a className="text-decoration-none" href="#">User
                    Agreement</a> <br /> and <a className="text-decoration-none" href="#">Privacy Policy</a>.
                  </p>
                  <form id="login-form" action="">
                    <div className="form-floating mb-3">
                      <input type="text" className="form-control" id="email" name="email" placeholder="Email"
                        required="required" />
                      <label htmlFor="email" className="text-secondary">Email</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input type="password" className="form-control" id="pwd" name="pwd"
                        placeholder="Password" required="required" />
                      <label htmlFor="lname" className="text-secondary">Password</label>
                    </div>

                    <a className="btn invert-scheme fw-bold rounded-pill w-100 text-white mb-1" onClick={() => login()}>Log in</a>
                    <div id="messages"></div>
                    <div className="d-flex">
                      <a href="#" className=" text-decoration-none">Forgot Password?</a>
                      <div className="flex-grow-1"></div>
                      <a href="/addUser" className=" text-decoration-none">Sign up</a>
                    </div>

                  </form>
                </div>
                <div className="bg-white col-lg-3 rounded-end">

                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-2"></div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;
