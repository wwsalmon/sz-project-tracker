import config from '../aws-exports';
import * as AWS from "aws-sdk";

export async function changeAcl(key, auth, level){

    let params = {
        IdentityPoolId: config.aws_cognito_identity_pool_id,
        Logins: {}
    }

    params.Logins[`cognito-idp.us-east-1.amazonaws.com/${config.aws_user_pools_id}`] =
        auth.user.signInUserSession.idToken.jwtToken;

    const ci = new AWS.CognitoIdentity({
        region: "us-east-1"
    });

    const credentials = await auth.getCurrentCredentials();

    ci.getId(params, (err, data) => {
        if (err) return Promise.reject("autherror");

        const userSub = data.IdentityId;

        if (!(credentials && userSub)){
            console.log("something's wrong with auth.", credentials, userSub);
            return Promise.reject("autherror");
        }

        const s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            credentials: credentials,
            region: "us-east-1"
        });

        const readParams = {
            Bucket: config.aws_user_files_s3_bucket,
            Key: `private/${userSub}/${key}`,
        }

        console.log("reading ACL with query", readParams);

        s3.getObjectAcl(readParams, (err, data) => {
            if (level === "public"){

                console.log("Changing to public");

                if (data["Grants"].length > 1) {

                    console.log("Already public");

                    return Promise.resolve("nochange");
                } else {

                    console.log("Adding public access...");

                    data["Grants"].push({
                        Grantee: {
                            Type: "Group",
                            URI: "http://acs.amazonaws.com/groups/global/AllUsers"
                        },
                        Permission: "READ"
                    });
                }
            } else if (level === "private"){

                console.log("Changing to private");

                if (data["Grants"].length > 1) {

                    console.log("Removing public access...");

                    data["Grants"] = data["Grants"].filter(d => d.Permission !== "READ");
                } else {

                    console.log("Already no public access");

                    return Promise.resolve("nochange");
                }
            }

            const setAclParams = {
                ...readParams,
                AccessControlPolicy: data
            }

            console.log("changing ACL with query", setAclParams);

            s3.putObjectAcl(setAclParams, (err, data) => {
                if (err) return Promise.reject("Error setting object ACL");

                console.log("Success!");

                return Promise.resolve("success")
            });
        });
    });
}