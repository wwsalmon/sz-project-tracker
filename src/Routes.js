import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./containers/Home";
import Login from "./containers/Login";
// import NewProject from "./containers/NewProject";
import Project from "./containers/Project";
import Projects from "./containers/Projects";

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route exact path="/login">
                <Login />
            </Route>
            <Route exact path="/projects">
                <Projects />
            </Route>
            {/*
            <Route exact path="/projects/new">
                <NewProject />
            </Route>
            */}
            <Route exact path="/projects/:id">
                <Project />
            </Route>
        </Switch>
    );
}