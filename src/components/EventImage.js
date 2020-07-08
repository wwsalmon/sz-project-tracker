import { Storage } from 'aws-amplify';
import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import config from "../aws-exports";

export default function EventImage(props){
    const [imgUrl, setImgUrl] = useState("");
    const [showLightbox, setShowLightbox] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function onLoad() {
            if (props.public){
                setImgUrl("https://" + config.aws_user_files_s3_bucket + ".s3.amazonaws.com/private/"
                + `${props.identityId}/${props.s3key}`);
            } else {
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
        }

        onLoad();
    }, [props.s3key, props.identityId, props.public]);

    return (
        <div className="p-2 bg-gray-200 mr-4" style={{width: 240, height: 120}}>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className={showLightbox ? "flex z-10 fixed inset-0 justify-center items-center" :
                    "w-full h-full cursor-pointer relative"}
                     onClick={() => !showLightbox && setShowLightbox(true)}>

                    <img alt="Update attachment"
                         src={imgUrl}
                         className={"max-h-full " + (showLightbox ? "z-20 p-4" :
                             "cursor-pointer block mx-auto relative top-1/2 -translate-y-1/2 transform")}/>

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