import React, { useState, useEffect } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import {useAuth} from "../lib/authLib";

export default function ResetPassword(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState(false);
    const [hasSentCode, setHasSentCode] = useState(false);
    const history = useHistory();
    const auth = useAuth();

    return (
        <>
            {error && (<p className="aside my-4 ~critical">{error}</p>)}
            <div className="max-w-sm mx-auto">
                <h1 className="heading">Reset password</h1>
                <hr className="my-8"/>
                { hasSentCode ? (
                    <>
                        <p className="mt-2 mb-8">Enter the code you received in your email and
                        a new password.</p>
                        <form onSubmit={e => {
                            e.preventDefault();
                            if (password !== confirmPassword){
                                setError("Passwords don't match, please fix and try again.");
                                return;
                            }
                            auth.signOut().then(() => {
                                setError(false);
                                auth.confirmResetPassword(username, code, password).then(() => {
                                    history.push({pathname: "/login",
                                        state: {message: "Password reset successfully. Enter your username" +
                                                " and password again to log in." }});
                                }).catch(e => {
                                    setError(e.message);
                                });
                            });
                        }}>
                            <p className="label my-2">Verification code</p>
                            <input type="text" className="field ~neutral !normal w-auto my-1 w-full"
                                   value={code}
                                   onChange={e => setCode(e.target.value)}/>
                            <p className="label my-2">New password</p>
                            <input type="password" className="field ~neutral !normal w-auto my-1 w-full"
                                   value={password}
                                   onChange={e => setPassword(e.target.value)}/>
                            <p className="label my-2">Confirm new password</p>
                            <input type="password" className="field ~neutral !normal w-auto my-1 w-full"
                                   value={confirmPassword}
                                   onChange={e => setConfirmPassword(e.target.value)}/>
                            <div className="flex justify-end">
                                <input type="submit" className="button ~info !high w-auto block my-4"/>
                            </div>
                        </form>
                        <hr className="my-8"/>
                        <div className="flex justify-between items-center">
                            <p>Didn't get an email?</p>
                            <button className="button !high ~neutral">Go back</button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="mt-2 mb-8">Enter your username to get an email with a
                            confirmation code allowing you to set your password.</p>
                        <form onSubmit={e => {
                            e.preventDefault();
                            setError(false);
                            auth.startResetPassword(username).then(() => {
                                setHasSentCode(true);
                            }).catch(e => {
                                setError(e.message);
                            });
                        }}>
                            <p className="label my-2">Username</p>
                            <input type="text" className="field ~neutral !normal w-auto my-1 w-full"
                                   value={username}
                                   onChange={e => setUsername(e.target.value)}/>
                            <div className="flex justify-end">
                                <input type="submit" className="button ~info !high w-auto block my-4"/>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </>
    )
}