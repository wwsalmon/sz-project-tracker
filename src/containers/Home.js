import React from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from "../lib/authLib";
import {Helmet} from "react-helmet";
import getTitle from "../lib/getTitle";

export default function Home() {
    const auth = useAuth();

    return (
        <>
            <Helmet>
                <title>{getTitle("Home")}</title>
            </Helmet>
            <div className="text-center">
                <h1 className="heading my-8">Project Tracker</h1>
                <p className="max-w-3xl mx-auto content">Made by <a href="https://twitter.com/wwsalmon">Samson
                    Zhang</a> at <a
                    href="https://summerofshipping.com/">Summer of Shipping 2020</a>.</p>
                <p className="max-w-3xl mx-auto my-8 aside ~warning !normal ">Development version, don't actually use
                    this to store data you care about!</p>
                {auth.authState === "signedIn" ? (
                    <>
                        <p>You're already logged in.</p>
                        <Link to="/projects">
                            <button className="button !high ~info my-4">Go to app</button>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            <button className="button !low ~info my-4">Log in</button>
                        </Link>
                        <Link to="/signup">
                            <button className="button !high ~info my-4">Sign up</button>
                        </Link>
                    </>
                )}
            </div>
        </>
    )
}