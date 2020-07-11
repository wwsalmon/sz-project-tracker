// lots of code from https://usehooks.com/useAuth/

import React, { useState, useEffect, useContext, createContext } from "react";
import { Auth, Hub } from 'aws-amplify';
import * as AWS from "aws-sdk";
import config from "../aws-exports";
import "dotenv";

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

    const startResetPassword = (username) => {
        return Auth.forgotPassword(username);
    }

    const confirmResetPassword = (username, code, password) => {
        return Auth.forgotPasswordSubmit(username, code, password);
    }

    const getCurrentCredentials = () => {
        return Auth.currentCredentials();
    }

    const getIdentityId = () => {
        let params = {
            IdentityPoolId: config.aws_cognito_identity_pool_id,
            Logins: {}
        }

        params.Logins[`cognito-idp.us-east-1.amazonaws.com/${config.aws_user_pools_id}`] =
            user.signInUserSession.idToken.jwtToken;

        const ci = new AWS.CognitoIdentity({
            region: "us-east-1"
        });

        return new Promise((res, rej) => {
            ci.getId(params, (err, data) => {
                if (err) return rej("error");
                console.log(data);
                return res(data.IdentityId);
            });
        });
    }

    // help from https://stackoverflow.com/questions/41000259/why-isnt-mailchimp-api-working-with-fetch

    async function addToMailchimp(email){
        const url = "https://bel7t7wvbj.execute-api.us-east-1.amazonaws.com/live/";
        const body = JSON.stringify({
            "email": email
        });
        const params = {
            mode: "cors",
            method: "POST",
            body: body,
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": process.env.REACT_APP_MC_API_KEY
            }
        };
        try{
            await fetch(url, params);
        } catch(e){
            // do nothing
        }
        return Promise.resolve("done");
    }

    useEffect(() => {
        window.mcfunc = addToMailchimp;
        checkCurrentAuth().then(res => {
            console.log(res);
        }).catch(e => {
            console.log(e);
        });
        // eslint-disable-next-line
    }, []);

    return {user, username, setUsername, authState, signIn, signInWithGoogle, checkGoogle,
        signUp,confirmSignUp, signOut, forceState, resendConfirmation, startResetPassword,
        confirmResetPassword, getCurrentCredentials, getIdentityId, addToMailchimp};
}