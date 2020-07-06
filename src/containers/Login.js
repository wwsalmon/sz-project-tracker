import React, { useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import {useAuth} from "../lib/authLib";
import GoogleButton from "react-google-button";

export default function Login(props){
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const propState = props.location.state;
    const history = useHistory();
    const auth = useAuth();

    const message = propState === undefined ? false : propState.message

    return (
        <>
            {isLoading && (<p className="aside ~info my-4">Loading...</p>)}
            {message && (<p className="aside my-4 ~warning">{message}</p>)}
            {error && (<p className="aside my-4 ~critical">{error}</p>)}
            {
                {
                    signedOut: (
                        <div className="max-w-sm mx-auto">
                            <h1 className="heading">Log in</h1>
                            <hr className="my-8"/>
                            <GoogleButton onClick={auth.signInWithGoogle}/>
                            <hr className="my-8"/>
                            <form onSubmit={e => {
                                e.preventDefault();
                                setError(false);
                                setIsLoading(true);
                                auth.signIn(username, password).catch(e => {
                                    if (e.code === "UserNotConfirmedException"){
                                        auth.setUsername(username);
                                        auth.forceState("getConfirm");
                                        history.push("/signup");
                                    } else {
                                        setError(e.message);
                                        setIsLoading(false);
                                    }
                                });
                            }}>
                                <p className="label my-2">Username</p>
                                <input type="text" className="field ~neutral !normal w-auto my-1 w-full"
                                       value={username}
                                       onChange={e => setUsername(e.target.value)}/>
                                <p className="label my-2">Password</p>
                                <input type="password" className="field ~neutral !normal w-auto my-1 w-full"
                                       value={password}
                                       onChange={e => setPassword(e.target.value)}/>
                                <div className="flex justify-end">
                                    <input type="submit" className="button ~info !high w-auto block my-4"/>
                                </div>
                                <div className="content opacity-25">
                                    <Link to="/resetpassword">
                                        <p>Forgot your password?</p>
                                    </Link>
                                </div>
                                <hr className="my-8"/>
                                <div className="flex justify-between items-center my-4">
                                    <p className="label">Don't have an account?</p>
                                    <Link to="/signup">
                                        <button className="button !high ~neutral">Sign up</button>
                                    </Link>
                                </div>
                            </form>
                        </div>
                    ), signedIn: (
                        <Redirect to={{pathname: "/projects", state: {justLoggedIn: true}}}/>
                    ), confirm: (
                        <Redirect to="signup"/>
                    ),
                }[auth.authState]
            }
        </>

    )
}