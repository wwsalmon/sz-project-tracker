import React, {useEffect} from "react";
import {useAuth} from "../lib/authLib";
import {useHistory} from "react-router-dom";
import {Helmet} from "react-helmet";
import getTitle from "../lib/getTitle";

export default function GoogleRedirect() {
    const auth = useAuth();
    const history = useHistory();

    useEffect(() => {
        auth.checkGoogle().then(res => {
            if (res === "success") {
                history.push({pathname: "/projects", state: {justLoggedIn: true}});
            } else {
                history.push("/login");
            }
        });
    }, [auth, history]);

    return (
        <>
            <Helmet>
                <title>{getTitle("Redirecting...")}</title>
            </Helmet>
            <p>Redirecting...</p>
        </>
    )
}