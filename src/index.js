import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css'
import CreatePost from './components/CreatePost'
import Header from './components/Header';
import Login from './components/Login';
import AddUser from './components/AddUser';
import AdminHome from './components/admin/admin_home';
import UserTable from './components/admin/ManageUsers';
import SubTable from './components/admin/ManageSubs';

ReactDOM.render(
  <React.StrictMode>
    <Header/>
    <BrowserRouter>
    <Routes>
      <Route path="/createPost" element={<CreatePost />} />
      <Route path="/login" element={<Login />} />
      <Route path="/addUser" element={<AddUser />} />
      <Route path="/AdminHome" element={<AdminHome />} />
      <Route path="/ManageUsers" element={<UserTable />} />
      <Route path="/ManageSubs" element={<SubTable />} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
