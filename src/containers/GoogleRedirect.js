import React, {useEffect} from "react";
import {useAuth} from "../lib/authLib";
import {useHistory} from "react-router-dom";

export default function GoogleRedirect(){
    const auth = useAuth();
    const history = useHistory();

    useEffect(() => {
        auth.checkGoogle().then(res => {
            if (res === "success"){
                history.push("/projects", {state: {justLoggedIn: true}});
            } else{
                history.push("/login");
            }
        });
    }, [auth, history]);

    return(
        <p>Redirecting...</p>
    )
}