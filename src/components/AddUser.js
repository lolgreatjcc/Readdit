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
const AddUser = () => {
  //Defining States
  const baseUrl = [process.env.REACT_APP_BASEURL1, process.env.REACT_APP_BASEURL2];

  function addUser() {
    const url = `https://readdit-backend.herokuapp.com/users`;

    // data extraction
    toast.info("Adding new user...")
    var emailRegex = new RegExp('^.+@.+\\..{2,}$');
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById(`password`).value;
    var two_fa = document.getElementById('two_fa').value;

    //checking and assigning two_fa value
    if (two_fa == "1") {
      two_fa = 1;
    }
    else {
      two_fa = 0;
    }

    //create webformdata
    const webFormData = new FormData();
    webFormData.append('email', email);
    webFormData.append('password', password);
    webFormData.append('username', username);
    webFormData.append('two_fa', two_fa);
    webFormData.append('fk_user_type_id', 1);
    webFormData.append("image", document.getElementById('image').files[0]);

    //check if required fields are blank
    if (username.trim() == "" || email.trim() == "" || password.trim() == "") {
      console.log("Please fill all the required fields!");
      toast.warn("Input fields cannot be blank!");
    }
    //check if email format is wrong
    else if (!(emailRegex.test(email))) {
      console.log("Please enter a valid email!");
      toast.warn("Please enter a valid email!");
    }
    //call adduser function
    else {
      axios
        .post(url, webFormData)
        .then((data) => {
          if (data != null) {
            toast.success("User created successfully.");
            setTimeout(function () {
              window.location.assign(baseUrl[1] + "/login");
            }, 2000);
          } else {
            console.log("Error");
            toast.error("Error");
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          console.log(err.response.data.message);
        });
    }

  }

  return (
    <React.Fragment>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick limit={3} transition={Slide} rtl={false} theme="dark" pauseOnFocusLoss draggable pauseOnHover />
      {/* <wc-toast></wc-toast> */}
      <div className="container-xxl my-md-2">
        <div className="row">

          <div className="col-lg-2"></div>

          <div className="col-lg-8">
            <div className=" container-fluid">
              <div className="row rounded shadow" id="createUserImage">
                <div className="col-2">

                </div>
                <div className="col-7 bg-white p-5">


                  <h5 className="fw-bold">Sign Up</h5>
                  <p className="smaller">By continuing, you are agreeing to Readdit's <a className="text-decoration-none" href="#">User
                    Agreement</a> <br /> and <a className="text-decoration-none" href="#">Privacy Policy</a>. </p>
                  <div id="img">

                  </div>
                  <div className="form-floating mb-3">
                    <input className="form-control" id="username" rows="1" placeholder="Enter username"></input>
                    <label className="text-secondary">Username</label>
                  </div>

                  <div className="form-floating mb-3">

                    <input className="form-control" id="email" rows="1" placeholder="Enter email"></input>
                    <label className="text-secondary">Email</label>
                  </div>

                  <label htmlFor="image">Select Image for Profile Picture (Optional):</label>
                  <input type="file" className="form-control" id="image" name="image" /><br />

                  <div className="form-floating mb-3">
                    <input type="password" className="form-control" id="password" rows="1"
                      placeholder="Enter password"></input>
                    <label className="text-secondary">Password</label>
                  </div>
                  <div className="mb-3 form-check">

                    <label className="form-check-label">2 Factor Authentication</label>
                    <input type="checkbox" id="two_fa" className="form-check-input" />
                  </div>
                  <p><span id="msg"></span></p>
                  <p><input className="btn invert-scheme fw-bold rounded-pill w-100" type="button" id="Add"
                    value="Sign up" onClick={() => addUser()}/></p>
                  <div id="login_redirect">
                    <p className="smaller">
                      Already have an account? <a className="text-decoration-none" href="/login">Log in</a>
                    </p>
                  </div>
                </div>
                <div className="col-3 bg-white rounded-end">
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

export default AddUser;
