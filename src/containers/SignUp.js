import React, { useState } from "react";
import {useAuth} from "../lib/authLib";
import { Redirect, Link, useHistory } from 'react-router-dom';

export default function SignUp(){
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const auth = useAuth();
    const history = useHistory();

    return (
        <>
            {isLoading && (<p className="aside ~info my-4">Loading...</p>)}
            {
                {
                    signedOut: (
                        <>
                            <button className="button !normal ~neutral my-4"  onClick={auth.SignInWithGoogle}>
                                Sign up with Google
                            </button>
                            <Link to="/login"><button className="button !low ~neutral my-4">Log in instead</button></Link>
                            <h3>Or, sign up with email</h3>
                            <form onSubmit={e => {
                                e.preventDefault();
                                auth.signUp(username, password, email).catch(e => {
                                    if (e.code === "UsernameExistsException") history.push("/login");
                                });
                            }}>
                                <p className="label">Username:</p>
                                <input type="text" className="field ~neutral !normal w-auto my-1" value={username}
                                       onChange={e => setUsername(e.target.value)}/>
                                <p className="label">Email:</p>
                                <input type="text" className="field ~neutral !normal w-auto my-1" value={email}
                                       onChange={e => setEmail(e.target.value)}/>
                                <p className="label">Password:</p>
                                <input type="password" className="field ~neutral !normal w-auto my-1" value={password}
                                       onChange={e => setPassword(e.target.value)}/>
                                <input type="submit" className="button field w-auto block my-4"/>
                            </form>
                        </>
                    ), signedIn: (
                        <Redirect to={{pathname: "/projects", state: {justLoggedIn: true}}}/>
                    ), confirmSignUp: (
                        <>
                            <h3>Confirm your account</h3>
                            <form onSubmit={e => {
                                e.preventDefault();
                                setIsLoading(true);
                                auth.confirmSignUp(username, code).then(setIsLoading(false));
                            }}>
                                <p className="label">Enter the code sent to your email.</p>
                                <input type="text" className="field ~neutral !normal w-auto my-1"
                                       value={code} onChange={e => setCode(e.target.value)}/>
                                <input type="submit" className="button field w-auto block my-4"/>
                            </form>
                        </>
                    )
                }[auth.authState]
            }
        </>
    )
}