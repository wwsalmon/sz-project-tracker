import React, { useEffect } from "react";
// import { API } from "aws-amplify";

export default function Settings(){
    useEffect(() => {
        console.log("useEffect");
    }, []);

    return (
        <p>Settings page</p>
    )
}