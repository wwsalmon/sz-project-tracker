import { Storage } from 'aws-amplify';
import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function EventImage(props){
    const [imgUrl, setImgUrl] = useState("");
    const [showLightbox, setShowLightbox] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function onLoad() {
            Storage.vault.get(props.s3key)
                .then(res => {
                    setImgUrl(res);
                    setIsLoading(false);
                })
                .catch(e => {
                    console.log(e);
                    setIsLoading(false);
                });
        }

        onLoad();
    }, [props.s3key]);

    return (
        <div className={props.className}>
            {isLoading && (
                <p>Loading...</p>
            )}
            {!isLoading && (
                <div className={showLightbox ? "z-10 fixed inset-0 flex justify-center items-center" : ""}>
                    <img onClick={() => !showLightbox && setShowLightbox(true)}
                         alt="Update attachment"
                         src={imgUrl}
                         className={showLightbox ? "z-20 max-h-full max-w-full p-4" : "cursor-pointer"}/>
                    {showLightbox && (
                        <>
                            <div className="fixed top-4 z-30 cursor-pointer right-4 shield ~neutral !normal"
                                 onClick={() => setShowLightbox(false)}>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faTimes}/>
                                </span>
                            </div>
                            <div onClick={() => setShowLightbox(false)}
                                 className="opacity-50 fixed inset-0 z-10 bg-black cursor-pointer"/>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}