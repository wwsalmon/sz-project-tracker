import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./containers/Home";
import Login from "./containers/Login";
import SignUp from "./containers/SignUp";
import NewProject from "./containers/NewProject";
import Project from "./containers/Project";
import Projects from "./containers/Projects";
import PublicProject from "./containers/PublicProject";
import GoogleRedirect from "./containers/GoogleRedirect";
import Settings from "./containers/Settings";
import ResetPassword from "./containers/ResetPassword";
import Navbar from "./components/Navbar";
import Test from "./containers/Test";

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/">
                <Navbar context="home"/>
                <Home />
            </Route>
            <Route exact path="/public/:id/:postid?">
                <Navbar context="public"/>
                <PublicProject />
            </Route>
            <Route>
                <Navbar context="app"/>
                <Route exact path="/login" render={(props) => <Login {...props} />}/>
                <Route exact path="/test">
                    <Test />
                </Route>
                <Route exact path="/signup">
                    <SignUp />
                </Route>
                <Route exact path="/googleredirect">
                    <GoogleRedirect/>
                </Route>
                <Route exact path="/newproject">
                    <NewProject />
                </Route>
                <Route exact path="/projects/:id">
                    <Project />
                </Route>
                <Route exact path="/projects" render={(props) => <Projects {...props} />}/>
                <Route exact path="/resetpassword">
                    <ResetPassword/>
                </Route>
                <Route exact path="/settings">
                    <Settings/>
                </Route>
            </Route>
        </Switch>
    );
}