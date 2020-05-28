import { Storage } from 'aws-amplify';
import React, { useState, useEffect } from 'react';

export default function EventImage(props){
    console.log(props);
    const [imgUrl, setImgUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function onLoad(){
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

    useEffect(() => {
        onLoad();
    }, []);

    return (
        <div className={props.className}>
            {isLoading && (
                <p>Loading...</p>
            )}
            {!isLoading && (
                <img src={imgUrl}></img>
            )}
        </div>
    )
}