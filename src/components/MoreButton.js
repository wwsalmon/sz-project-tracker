import React, { useState, useRef } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

export default function MoreButton(props){
    const uid = props.uid;
    const [isExpanded, setIsExpanded] = useState(false);
    const thisButton = useRef(null);

    window.addEventListener('click', e => {
        const secondParent = (e.target.parentElement !== null) ? e.target.parentElement.parentElement !== thisButton.current : true;

        const isNotButton = e.target !== thisButton.current
            && e.target.parentElement !== thisButton.current
            && secondParent;

        if (isNotButton) {
            setIsExpanded(false);
        }
    });

    return (
        <>
            <button className={props.className} id={uid + "-showMoreButton"} ref={thisButton} onClick={() => setIsExpanded(!isExpanded)}><FontAwesomeIcon icon={faEllipsisV}></FontAwesomeIcon></button>
            { isExpanded && (
                <div className="flex absolute flex-col bg-white right-0 rounded top-8 mt-8 py-2 border z-10">
                    {props.children}
                </div>
            )}
        </>
    )
}