import React from "react";
import {useHistory} from "react-router-dom";
import {Auth} from "aws-amplify";

export default function SignOut(props){
    const history = useHistory();

    async function signOut() {
        try {
            await Auth.signOut();
            history.push("/")
        }
        catch (error) {
            console.log('error signing out: ', error);
        }
    }

    return(
        <button className={props.className} onClick={signOut}>Sign out</button>
    )
}