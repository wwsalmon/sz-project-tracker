import React from 'react';
import {Link} from 'react-router-dom';

export default function Home(){
    return(
        <>
            <div className="text-center">
                <h1 className="heading my-8">Project Tracker</h1>
                <p className="max-w-3xl mx-auto content">Made by <a href="https://twitter.com/wwsalmon">Samson Zhang</a> at <a
                    href="https://summerofshipping.com/">Summer of Shipping 2020</a>.</p>
                <p className="max-w-3xl mx-auto my-8 aside ~warning !normal ">Development version, don't actually use this to store data you care about!</p>
                <Link to="/login"><button className="button !low ~info my-4">Log in</button></Link>
                <Link to="/signup"><button className="button !high ~info my-4">Sign up</button></Link>
            </div>
        </>
    )
}