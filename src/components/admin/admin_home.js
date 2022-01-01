// Module Imports
import React, { useState, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";
import  { Navigate } from 'react-router-dom'

const AdminHome = () => {

    const [redirect, editRedirect] = useState(0);

    function UsersClicked() {
        console.log(redirect);
        editRedirect(1);
    }

    function SubsClicked() {
        console.log(redirect);
        editRedirect(2);
    }

    function renderRedirect() {
        if (redirect == 1) {
            return <Navigate to='/ManageUsers'/>
        }
        else if (redirect == 2) {
            return <Navigate to='/ManageSubs'/>
        }
    }

    return(
        <div class="container-xxl my-md-2">
        <div class="row">
            <div class="col-3"></div>
            <div class="col-6">
                <div class="bg-white body-borders rounded shadow p-3">
                    <h5>Admin Menu</h5>
                    <div class="row">
                        {renderRedirect()}
                        <div class="col-6">
                            <button onClick={() => UsersClicked()} type="submit" class="btn btn-block invert-scheme h-100" id="M-users">Manage
                                Users</button>
                        </div>
                        <div class="col-6">
                            <button onClick={() => SubsClicked()} type="submit" class="btn btn-block invert-scheme" id="M-sub">Manage
                                Subreaddits</button>
                        </div>
        
        
                    </div>
                </div>
            </div>

            <div class="col-3"></div>
        </div>
    </div>
    );
};

export default AdminHome;

