import React from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from "../lib/authLib";
import {Helmet} from "react-helmet";
import getTitle from "../lib/getTitle";
import ReactTooltip from "react-tooltip";
import maincapture from "../assets/sc/maincapture.jpg";
import editing from "../assets/sc/editing.jpg";
import projects from "../assets/sc/projects.jpg";
import publicproject from "../assets/sc/publicproject.jpg";

export default function Home() {
    const auth = useAuth();

    return (
        <>
            <Helmet>
                <title>{getTitle("Home")}</title>
            </Helmet>
            <div className="text-center">
                <h1 className="heading text-4xl mt-8">
                    SZ Project Tracker <span data-tip="Expect it to be functional but possibly buggy" className="chip ~info !normal my-4">
                        v0
                    </span>
                </h1>
                <h3 className="subheading mb-8">Effortless project/learning/anything logs</h3>
                <ReactTooltip/>
                {auth.authState === "signedIn" ? (
                    <>
                        <p>You're already logged in.</p>
                        <Link to="/projects">
                            <button className="button !high ~info my-4">Go to app</button>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/signup">
                            <button className="button !high ~info my-4 text-2xl p-4">Get started</button>
                        </Link>
                    </>
                )}
            </div>
            <div className="text-center">
                <img src={maincapture} className="my-8 max-w-xl inline shadow-2xl" alt=""/>

                <hr className="sep"/>
                <hr/>
                <hr className="sep"/>

                <h3 className="heading">Build in public</h3>
                <p className="subheading my-4">Make your project viewable by public link</p>
                <img src={publicproject} className="my-8 max-w-xl inline shadow-xl" alt=""/>

                <hr className="sep"/>
                <hr/>
                <hr className="sep"/>

                <h3 className="heading">Effortless logging experience</h3>
                <p className="subheading my-4">Notes in markdown + drag & drop image uploads</p>
                <img src={editing} className="my-8 max-w-xl inline shadow-xl" alt=""/>

                <hr className="sep"/>
                <hr/>
                <hr className="sep"/>

                <h3 className="heading">Get started today</h3>
                <p className="subheading my-4">It's free, it's useful, it's beautiful. What more reason do you need?</p>
                <div>
                    <img src={projects} className="my-8 max-w-xl inline shadow-xl" alt=""/>
                </div>
                <div>
                    <Link to="/signup">
                        <button className="button !high ~info my-4 text-2xl p-4">Sign up for free</button>
                    </Link>
                </div>

            </div>
        </>
    )
}