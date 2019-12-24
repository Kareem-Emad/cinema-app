import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import HomePage from './components/homepage/homepage'
import Signup from "./components/signup/signup";
import Signin from "./components/signin/signin";
import Screening from "./components/screening/screening"
import AdminMovie from "./components/admin/admin";
import AdminScreening from "./components/admin_screening/admin";

export default function BasicExample() {
  return (
    <Router>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/screening/:id">
            <Screening></Screening>
          </Route>

          <Route path="/register">
            <Signup/>
          </Route>
          <Route path="/admin_movie">
            <AdminMovie></AdminMovie>
          </Route>
          <Route path="/admin_screen">
            <AdminScreening></AdminScreening>
          </Route>
          <Route path="/login">
            <Signin/>
          </Route>
        </Switch>
    </Router>
  );
}



function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}
