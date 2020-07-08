import React from "react";
import {Storage} from "aws-amplify";
import {changeAcl} from "../lib/aclLib";
import {useAuth} from "../lib/authLib";

export default function Test() {
    const testFileKey = "f0669e40-c121-11ea-a2bc-3d09ae941ac8.jpg";
    const auth = useAuth();

    return auth.authState === "signedIn" ? (
        <>
            <button onClick={() => console.log(auth.user)}>User info</button>
            <button className="button"
                    onClick={() => {
                        changeAcl(testFileKey, auth, "public")
                    }}>Make public
            </button>
            <button className="button"
                    onClick={() => {
                        changeAcl(testFileKey, auth, "private")
                    }}>Make private
            </button>
        </>
    ) : (
        <p>Loading...</p>
    )
}