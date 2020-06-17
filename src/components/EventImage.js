import { Storage } from 'aws-amplify';
import React, { useState, useEffect } from 'react';

export default function EventImage(props){
    const [imgUrl, setImgUrl] = useState("");
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
                <img alt="Update attachment" src={imgUrl}></img>
            )}
        </div>
    )
}