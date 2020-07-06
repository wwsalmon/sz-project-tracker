import React, {useEffect} from "react";
import {Link, Redirect} from "react-router-dom";
import {useAuth} from "../lib/authLib";

export default function Settings() {
    const auth = useAuth();

    useEffect(() => {
        console.log("useEffect");
    }, []);

    return auth.authState === "signedIn" ? (
        <div className="max-w-sm mx-auto content">
            <h1 className="heading">Settings</h1>
            <hr className="my-8"/>
            <p><Link to="/resetpassword">Reset your password</Link></p>
            <p>Delete account (feature coming soon)</p>
        </div>
    ) : (
        <Redirect to={{pathname: "/login", state: {message: "You must be logged in to access settings."}}}/>
    )
}