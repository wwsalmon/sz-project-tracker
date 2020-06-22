// lots of code from https://usehooks.com/useAuth/

import React, { useState, useEffect, useContext, createContext } from "react";
import { Auth } from 'aws-amplify';

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

    const signIn = (username, password) => {
        return Auth.signIn(username, password).then(res => {
            setAuthState("signedIn");
            console.log(res);
            setUser(res);
        })
    }

    const signInWithGoogle = () => {
        Auth.federatedSignIn({ provider: 'Google' });
    }

    const signUp = (username, password, email) => {
        return Auth.signUp({username, password, attributes: {email}}).then(res => {
            console.log(res);
            setAuthState("getConfirm");
        });
    }

    const confirmSignUp = (username, code) => {
        return Auth.confirmSignUp(username, code).then(res => {
            console.log(res);
            setUser(res);
            setAuthState("signedIn");
        });
    }

    const signOut = () => {
        return Auth.signOut().then(() => {
            setUser(false);
            setAuthState("signedOut");
        })
    }

    useEffect(() => {
        Auth.currentAuthenticatedUser().then(res => {
            setUser(res);
            setAuthState("signedIn");
        }).catch(e => {
            setUser(false);
            setAuthState("signedOut");
        });
    }, []);

    return {user, authState, signIn, signInWithGoogle, signUp, confirmSignUp, signOut};
}