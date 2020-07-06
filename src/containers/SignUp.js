import React, { useState } from "react";
import {useAuth} from "../lib/authLib";
import { Redirect, Link, useHistory } from 'react-router-dom';
import GoogleButton from "react-google-button";

export default function SignUp(){
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState(false);
    const [hasResent, setHasResent] = useState(false);
    const auth = useAuth();
    const history = useHistory();

    return (
        <>
            {isLoading && (<p className="aside ~info my-4">Loading...</p>)}
            {error && (<p className="aside my-4 ~critical">{error}</p>)}
            <div className="max-w-sm mx-auto">
            {
                {
                    signedOut: (
                        <>
                            <h1 className="heading">Sign up</h1>
                            <hr className="my-8"/>
                            <GoogleButton label="Sign up with Google" onClick={auth.signInWithGoogle}/>
                            <hr className="my-8"/>
                            <form onSubmit={e => {
                                e.preventDefault();
                                auth.signUp(username, password, email).catch(e => {
                                    if (e.code === "UsernameExistsException") {
                                        history.push({pathname: "/login",
                                            state: {message: "User already exists. Try logging in instead:"}});
                                    } else {
                                        setError(e.message);
                                    }
                                });
                            }}>
                                <p className="label my-2">Username:</p>
                                <input type="text" className="field ~neutral !normal w-full my-1" value={username}
                                       onChange={e => setUsername(e.target.value)}/>
                                <p className="label my-2">Email:</p>
                                <input type="text" className="field ~neutral !normal w-full my-1" value={email}
                                       onChange={e => setEmail(e.target.value)}/>
                                <p className="label my-2">Password:</p>
                                <input type="password" className="field ~neutral !normal w-full my-1" value={password}
                                       onChange={e => setPassword(e.target.value)}/>
                                <div className="flex justify-end">
                                    <input type="submit" className="button ~info !high w-auto block my-4"/>
                                </div>
                            </form>
                            <hr className="my-8"/>
                            <div className="flex justify-between items-center">
                                <p className="label">Already have an account?</p>
                                <Link to="/login">
                                    <button className="button !high ~neutral">Log in</button>
                                </Link>
                            </div>
                        </>
                    ), signedIn: (
                        <Redirect to={{pathname: "/projects", state: {justLoggedIn: true}}}/>
                    ), getConfirm: (
                        <>
                            <h1 className="heading">Confirm your account</h1>
                            <hr className="my-8"/>
                            <form onSubmit={e => {
                                e.preventDefault();
                                setIsLoading(true);
                                auth.confirmSignUp(username || auth.username, code).then(() => {
                                    history.push({pathname: "/login",
                                        state: {message: "Your account has been verified. Enter your username and" +
                                                " password again to log in."}})
                                });
                            }}>
                                <p className="label my-2">Enter the code sent to your email.</p>
                                <input type="text" className="field ~neutral !normal w-full my-1"
                                       value={code} onChange={e => setCode(e.target.value)}/>
                                <div className="flex justify-end">
                                    <input type="submit" className="button ~info !high w-auto block my-4"/>
                                </div>
                            </form>
                            <hr className="my-8"/>
                            <div className="flex justify-between items-center">
                                {hasResent ? (
                                    <p>Email resent.</p>
                                ) : (
                                    <>
                                        <p>Didn't get an email?</p>
                                        <button className="button !high ~neutral"
                                                onClick={() => {
                                                    auth.resendConfirmation().then(() => {setHasResent(true);})
                                                        .catch(e => console.log(e));
                                                }}>Resend</button>
                                    </>
                                )}
                            </div>
                        </>
                    )
                }[auth.authState]
            }
            </div>
        </>
    )
}