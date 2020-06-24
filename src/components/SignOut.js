import React from "react";
import {useHistory} from "react-router-dom";
import {useAuth} from "../lib/authLib";

export default function SignOut(props){
    const history = useHistory();
    const auth = useAuth();

    async function signOut() {
        auth.signOut().then(() => {
            history.push("/");
        }).catch(e => {
            console.warn(e);
        });
    }

    return(
        <button className={"button focus:outline-none" + props.className} onClick={signOut}>Sign out</button>
    )
}