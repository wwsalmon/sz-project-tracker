import React, {useState, useEffect} from "react";
import {Storage} from "aws-amplify";
import * as AWS from "aws-sdk";
import config from '../aws-exports';
import {useAuth} from "../lib/authLib";

export default function Test(){
    const bucketName = config.aws_user_files_s3_bucket;
    const testFileKey = "private/us-east-1:55ce86cc-c1c5-473b-b59e-e1b49812fb82/8ed8bee0-ba2f-11ea-82b0-896efb9c304d.jpg";
    const auth = useAuth();

    useEffect(() => {
        if (auth.authState === "signedIn") runTest();
    }, [auth.authState]);

    async function runTest(){
        const credentials = await auth.getCurrentCredentials();

        const s3 = new AWS.S3({
            credentials: credentials,
            region: "us-east-1"
        })

        const params = {
            Bucket: bucketName,
            Key: testFileKey,
        }

        s3.getObject(params, (err, data) => {
            if (err) console.log(err);
            else console.log(data);
        });

        return true;
    }

    return (
        <p>Test</p>
    )
}