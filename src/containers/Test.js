import React, {useState, useEffect} from "react";
import {Storage} from "aws-amplify";
import * as AWS from "aws-sdk";
import config from '../aws-exports';
import {useAuth} from "../lib/authLib";

export default function Test(){
    const bucketName = config.aws_user_files_s3_bucket;
    const testFileKey = "private/us-east-1:1c2649c1-df20-47f2-9435-ab5cf8fcb4fa/f0669e40-c121-11ea-a2bc-3d09ae941ac8.jpg";
    const auth = useAuth();

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

        function readAcl(){
            s3.getObjectAcl(readParams, (err, data) => {
                if (err) console.log(err);
                else console.log(data);
            });
        }

        s3.getObjectAcl(readParams, (err, data) => {
            if (err) {console.log(err); return;}
            console.log(data);

            if (data["Grants"].length > 1){
                console.log("removing public access");
                data["Grants"] = data["Grants"].filter(d => d.Permission !== "READ");
            } else {
                console.log("adding public access");
                data["Grants"].push({
                    Grantee: {
                        Type: "Group",
                        URI: "http://acs.amazonaws.com/groups/global/AllUsers"
                    },
                    Permission: "READ"
                });
            }

            const setAclParams = {
                Bucket: bucketName,
                Key: testFileKey,
                AccessControlPolicy: data
            }

            console.log(setAclParams);

            s3.putObjectAcl(setAclParams, (err, data) => {
                if (err) console.log(err);
                else readAcl();
            });
        });

        // let setAclParams = readParams;
        // setAclParams["GrantRead"] = "uri=http://acs.amazonaws.com/groups/global/AllUsers";
    }

    return auth.authState === "signedIn" ? (
        <button className="button" onClick={runTest}>Run test</button>
    ) : (
        <p>Loading...</p>
    )
}