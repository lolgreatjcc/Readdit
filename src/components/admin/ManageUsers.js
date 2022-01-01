// Module Imports
import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';

import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate } from 'react-router-dom'

const UserTable = () => {
    const baseUrl = [process.env.REACT_APP_BASEURL1, process.env.REACT_APP_BASEURL2];
    const [redirect, editRedirect] = useState(0);

    function displayUsers() {
        axios.get(`https://readdit-backend.herokuapp.com/users`, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
            .then(response => {
                var data = response.data;
                let appendString = document.createDocumentFragment();
                for (var i = 0; i < data.Result.length; i++) {
                    var rowElement = document.createElement('tr');
                    var user = data.Result[i];
                    if (user.two_fa == 1) {
                        var twofa = "On"
                    }
                    else {
                        var twofa = "Off"
                    }

                    if (user.fk_user_type_id == 1) {
                        var type = "User"
                    }
                    else if (user.fk_user_type_id == 2) {
                        var type = "Admin"
                    }

                    if (user.profile_pic == null) {
                        user.profile_pic = 'https://res.cloudinary.com/readditmedia/image/upload/v1635600054/media/reddit_jjs25s.png';
                    }

                    var pfp = "";
                    if (user.profile_pic.slice(0, 5) == "https") {
                        pfp = (user.profile_pic).replace("https://res.cloudinary.com/readditmedia/image/upload/", "");
                    }
                    else {
                        pfp = (user.profile_pic).replace("http://res.cloudinary.com/readditmedia/image/upload/", "");
                    }


                    // if (user_id == user.user_id) {
                    if (false) {
                        rowElement.innerHTML = `<th scope="row">${i + 1}</th>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>${pfp}</td>
                        <td>${twofa}</td>
                        <td>${type}</td>
                        <td> <button type="submit" name="${user.username}" id = "${user.user_id}" class="EditCall rounded p-2" style="background-color:#dcd8f3; color:white; border-width: 0px;" disabled>Edit</button> </td>
                        <td> <button type="submit" name="${user.username}" id = "${user.user_id}" class="DeleteCall rounded p-2" style="background-color:#dcd8f3; color:white; border-width: 0px;" disabled>Delete</button> </td>`
                    }
                    else {
                        rowElement.innerHTML = `<th scope="row">${i + 1}</th>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>${pfp}</td>
                        <td>${twofa}</td>
                        <td>${type}</td>
                        <td> <button type="submit" name="${user.username}" id = "${user.user_id}" class="rounded p-2" style="background-Color:#6a5acd; color:white; border-Width: 0px">Edit</button> </td>
                        <td> <button type="submit" name="${user.username}" id = "${user.user_id}" class="rounded p-2" style="background-Color:#6a5acd; color:white; border-Width: 0px">Delete</button> </td>`
                    }
                    appendString.append(rowElement);
                }

                console.log(appendString);
                document.getElementById('users').append(appendString);
                document.getElementById('load').innerHTML = "";
            })
            .catch(error => {
                console.log("fail");
            })
    }

    function ReturnClicked() {
        console.log(redirect);
        editRedirect(2);
    }

    function renderRedirect() {
        if (redirect == 2) {
            return <Navigate to='/AdminHome'/>
        }
    }

    useEffect(() => displayUsers(), []);
    return (
        <body>
            <div className="container-xxl my-md-2">
                <div className="bg-white body-borders rounded shadow p-3">
                    <h3 className="text-scheme fw-bold">Manage Users</h3>
                    {renderRedirect()}
                    <div className="m-3">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Username</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Profile Pic URL</th>
                                    <th scope="col">2FA</th>
                                    <th scope="col">User Type</th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody id="users">
                            </tbody>
                        </table>
                        <div id="load">
                            <h5>LOADING USER TABLE...</h5>
                        </div>
                        <div className="row mt-3">
                            <div class="col-6">
                                <button type="submit" class="btn btn-block invert-scheme w-100" id="create">Create New User</button>
                            </div>
                            <div className="col-6">
                                <button onClick={() => ReturnClicked()} type="submit" class="btn btn-block invert-scheme w-100" id="return">Return</button>
                            </div>

                        </div>
                    </div>
                </div>


            </div>
        </body>
    );
};

export default UserTable;

