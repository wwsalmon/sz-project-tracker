import React from 'react';
import {Link} from 'react-router-dom';
import SignOut from './SignOut';
import {useAuth} from "../lib/authLib";
import MoreButton from "./MoreButton";

export default function Navbar(){
    const auth = useAuth();

    return (
        <div className="sz-navbar bg-gray-100 ">
            <div className="max-w-6xl px-4 sz-navbar-inner sz-navbar-left">
                <input type="checkbox" id="sz-navbar-check" />
                <label htmlFor="sz-navbar-check" className="sz-navbar-hamburger">☰</label>
                <div className="mr-4 supra opacity-50"><span>Project Tracker</span></div>
                <div className="sz-navbar-items flex-1">
                    {
                        auth.authState === "signedIn" ? (
                            <>
                                <div className="sz-navbar-item"><span><Link to="/projects">All Projects</Link></span></div>
                                <div className="sm:ml-auto sz-navbar-item pr-6 relative">
                                    <span className="opacity-50">Signed in as <b>{auth.user.attributes.name || auth.user.username}</b></span>
                                    <MoreButton className="absolute right-0 top-0">
                                        <SignOut className="hover:bg-gray-100 py-2 px-4 text-left"/>
                                        <button className="hover:bg-gray-100 py-2 px-4 text-left">
                                            <Link to="/settings">Settings</Link>
                                        </button>
                                    </MoreButton>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="sz-navbar-item sm:ml-auto"><span><Link to="/login">Log in</Link></span></div>
                                <div className="sz-navbar-item"><span><Link to="/signup">Sign up</Link></span></div>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    )
}