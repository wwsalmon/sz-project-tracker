import React from 'react';
import {Link} from 'react-router-dom';

export default function Home(){
    return(
        <>
            <Link to="/login"><button className="button !low ~positive my-4">Log in</button></Link>
            <Link to="/signup"><button className="button !high ~positive my-4">Sign up</button></Link>
        </>
    )
}