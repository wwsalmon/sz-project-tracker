import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import {useAuth} from "../lib/authLib";

export default function Login(props){
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState(false);
    const propState = props.location.state;
    const [message, setMessage] = useState(propState === undefined ? false : propState.message);
    const auth = useAuth();

    return (
        <>
            {isLoading && (<p className="aside ~info my-4">Loading...</p>)}
            {message && (<p className="aside my-4 ~warning">{message}</p>)}
            {error && (<p className="aside my-4 ~critical">{error}</p>)}
            {
                {
                    signedOut: (
                        <>
                            <button className="button !normal ~neutral my-4" onClick={() => {
                                auth.signInWithGoogle().then(res => {
                                    console.log(res);
                                })
                            }}>
                                Sign in with Google
                            </button>
                            <Link to="/signup"><button className="button !high ~neutral my-4">Sign up</button></Link>
                            <h3>Or, login with username</h3>
                            <form onSubmit={e => {
                                e.preventDefault();
                                setError(false);
                                setIsLoading(true);
                                auth.signIn(username, password).catch(e => {
                                    console.log(e);
                                    setError(e.message);
                                    setIsLoading(false);
                                });
                            }}>
                                <p className="label">Username:</p>
                                <input type="text" className="field ~neutral !normal w-auto my-1" value={username}
                                       onChange={e => setUsername(e.target.value)}/>
                                <p className="label">Password:</p>
                                <input type="password" className="field ~neutral !normal w-auto my-1" value={password}
                                       onChange={e => setPassword(e.target.value)}/>
                                <input type="submit" className="button field w-auto block my-4"/>
                            </form>
                        </>
                    ), signedIn: (
                        <Redirect to={{pathname: "/projects", state: {justLoggedIn: true}}}/>
                    ), confirm: (
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
                    ),
                }[auth.authState]
            }
        </>

    )
}