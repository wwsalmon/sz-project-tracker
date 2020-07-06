// lots of code from https://usehooks.com/useAuth/

import React, { useState, useEffect, useContext, createContext } from "react";
import { Auth, Hub } from 'aws-amplify';

const authContext = createContext();

export function ProvideAuth({children}){
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
    return useContext(authContext);
}

function useProvideAuth(){
    const [authState, setAuthState] = useState("loading");
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");

    const signIn = (username, password) => {
        return Auth.signIn(username, password).then(res => {
            setUser(res);
            setUsername(res.username);
            setAuthState("signedIn");
        })
    }

    const signInWithGoogle = () => {
        return Auth.federatedSignIn({ provider: 'Google' });
    }

    const signUp = (username, password, email) => {
        return Auth.signUp({username, password, attributes: {email}}).then(res => {
            setUsername(res.username);
            setAuthState("getConfirm");
        });
    }

    const checkGoogle = () => {
        return new Promise(resolve => {
            Hub.listen("auth", () => {
                checkCurrentAuth().then(res => {
                    resolve(res);
                });
            });
        });
    }

    const confirmSignUp = (username, code) => {
        return Auth.confirmSignUp(username, code).then(() => {
            setAuthState("signedOut");
        });
    }

    const signOut = () => {
        return Auth.signOut().then(() => {
            setAuthState("signedOut");
            setUsername("");
            setUser(false);
        })
    }

    const checkCurrentAuth = () => {
        return new Promise(resolve => {
            Auth.currentAuthenticatedUser().then(res => {
                setUser(res);
                setAuthState("signedIn");
                resolve("success");
            }).catch(e => {
                console.log(e);
                setUser(false);
                setUsername("");
                setAuthState("signedOut");
                resolve(e);
            });
        })
    }

    const resendConfirmation = () => {
        return Auth.resendSignUp(username);
    }

    const forceState = (state) => {
        setAuthState(state);
    }

    useEffect(() => {
        checkCurrentAuth().then(res => {
            console.log(res);
        }).catch(e => {
            console.log(e);
        });
    }, []);

    return {user, username, setUsername, authState, signIn, signInWithGoogle, checkGoogle,
        signUp,confirmSignUp, signOut, forceState, resendConfirmation};
}