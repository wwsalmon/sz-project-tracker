import React, { useState, useRef, useEffect } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

export default function MoreButton(props){
    const uid = props.uid;
    const [isExpanded, setIsExpanded] = useState(false);
    const thisButton = useRef(null);

    useEffect(() => {	
        window.addEventListener('click', e => {	
            const isNotButton = e.target !== thisButton.current && !(thisButton.current.contains(e.target));	
            if (isNotButton) {	
                setIsExpanded(false);	
            }	
        });	
    }, []);


    return (
        <div className={`absolute whitespace-no-wrap ${props.className}`} ref={thisButton}>
            <button className="opacity-50 focus:outline-none hover:bg-gray-300 px-2" id={uid + "-showMoreButton"}
                    onClick={() => setIsExpanded(!isExpanded)}>
                <FontAwesomeIcon icon={faEllipsisV}></FontAwesomeIcon>
            </button>
            { isExpanded && (
                <div className="flex absolute flex-col bg-white right-0 rounded mt-8 top-0 py-2 border z-10">
                    {props.children}
                </div>
            )}
        </div>
    )
}