import React, {useState, useEffect} from "react";
import {Storage} from "aws-amplify";
import * as AWS from "aws-sdk";
import config from '../aws-exports';
import {useAuth} from "../lib/authLib";

export default function Test(){
    const bucketName = config.aws_user_files_s3_bucket;
    const testFileKey = "private/us-east-1:1c2649c1-df20-47f2-9435-ab5cf8fcb4fa/17a0f8b0-c119-11ea-b126-b59938402f0c.jpg";
    const auth = useAuth();

    useEffect(() => {
        if (auth.authState === "signedIn") runTest();
    }, [auth.authState]);

    async function runTest(){
        console.log(await Storage.vault.get(testFileKey.split("/")[2]));

        const credentials = await auth.getCurrentCredentials();

        const s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            credentials: credentials,
            region: "us-east-1"
        })

        const readParams = {
            Bucket: bucketName,
            Key: testFileKey,
        }

        function callback(err, data){
            if (err) console.log(err);
            else console.log(data);
        }

        s3.getObject(readParams, callback)

        // let setAclParams = readParams;
        // setAclParams["GrantRead"] = "uri=http://acs.amazonaws.com/groups/global/AllUsers";

        s3.getObjectAcl(readParams, callback);
    }

    return (
        <p>Test</p>
    )
}