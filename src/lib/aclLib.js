import config from '../aws-exports';
import * as AWS from "aws-sdk";

export async function changeAcl(key, auth, level){

    const credentials = await auth.getCurrentCredentials();

    auth.getIdentityId().then(res => {

        if (!(credentials && res)){
            return Promise.reject("autherror");
        }

        const s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            credentials: credentials,
            region: "us-east-1"
        });

        const readParams = {
            Bucket: config.aws_user_files_s3_bucket,
            Key: `private/${res}/${key}`,
        }

        s3.getObjectAcl(readParams, (err, data) => {
            if (level === "public"){
                if (data["Grants"].length > 1) {
                    return Promise.resolve("nochange");
                } else {
                    data["Grants"].push({
                        Grantee: {
                            Type: "Group",
                            URI: "http://acs.amazonaws.com/groups/global/AllUsers"
                        },
                        Permission: "READ"
                    });
                }
            } else if (level === "private"){
                if (data["Grants"].length > 1) {
                    data["Grants"] = data["Grants"].filter(d => d.Permission !== "READ");
                } else {
                    return Promise.resolve("nochange");
                }
            }

            const setAclParams = {
                ...readParams,
                AccessControlPolicy: data
            }
            s3.putObjectAcl(setAclParams, (err, data) => {
                if (err) return Promise.reject("Error setting object ACL");
                return Promise.resolve("success")
            });
        });
    });
}