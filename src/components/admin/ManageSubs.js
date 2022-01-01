// Module Imports
import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';

import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate } from 'react-router-dom'

const SubTable = () => {
    const baseUrl = [process.env.REACT_APP_BASEURL1, process.env.REACT_APP_BASEURL2];
    const [redirect, editRedirect] = useState(0);

    function displaySubs() {
        axios.get(`https://readdit-backend.herokuapp.com/r/subreaddits`, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
            .then(response => {
                var data = response.data;
                let appendString = document.createDocumentFragment();

                for (var i = 0; i < data.Result.length; i++) {
                    var rowElement = document.createElement('tr');
                    var subreaddits = data.Result[i];
                    rowElement.innerHTML = `
                                            <th scope="row">${i + 1}</th>
                                            <td>${subreaddits.subreaddit_name}</td>
                                            <td>${subreaddits.subreaddit_description}</td>
                                            <td>${subreaddits["User.creator"]}</td>
                                            <td>${subreaddits.created_at}</td>
                                            <td> <button type="submit" name="${subreaddits.subreaddit_name}" id = "${subreaddits.subreaddit_id}" class="EditCall rounded p-2" style="background-Color:#6a5acd; color:white; border-Width: 0px">Edit</button> </td>
                                            <td> <button type="submit" id = "${subreaddits.subreaddit_id}" name="${subreaddits.subreaddit_name}" class="DeleteCall rounded p-2" style="background-Color:#6a5acd; color:white; border-Width: 0px">Delete</button> </td>`;
                    appendString.append(rowElement);
                }

                console.log(appendString);
                document.getElementById('subreaddits').append(appendString);
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

    useEffect(() => displaySubs(), []);
    return (
        <div class="container-xxl my-md-2">
            <div class="bg-white body-borders rounded shadow p-3">


                <h3 class="fw-bold text-scheme">Manage Subreaddits</h3>
                    <div class="m-3">
                        {renderRedirect()}
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Owner</th>
                                    <th scope="col">Created At</th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody id="subreaddits">

                            </tbody>
                        </table>
                        <div id="load">
                            <h5>LOADING SUBREADDITS TABLE...</h5>
                        </div>
                        <div class="d-flex flex-row">
                            <div class="flex-grow-1"></div>
                            <button onClick={() => ReturnClicked()} type="submit" class="btn btn-block w-25 invert-scheme" id="return">Return</button>
                        </div>

                    </div>
            </div>
        </div>

    );
};

export default SubTable;