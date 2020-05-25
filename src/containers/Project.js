import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, graphqlOperation, Auth } from "aws-amplify";

export default function Notes() {
    const { id } = useParams();
    const history = useHistory();
    const [projName, setProjName] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const query = `
        query {
            getProject(id: "${id}") {
                id
                name
            }
        }
    `

    useEffect(() => {
        function loadProject() {
            return API.graphql(graphqlOperation(query));
        }

        async function onLoad() {
            try {
                console.log("checking authentication");
                await Auth.currentAuthenticatedUser();
                console.log("authenticated");
            }
            catch (e) {
                console.log(e);
                history.push("/");
            }

            try{
                console.log("looking for project");
                const project = await loadProject();
                console.log("found project", project);
                setProjName(project.data.getProject.name);
                setIsLoading(false);
            }
            catch (e){
                console.log(e);
            }
        }

        onLoad();
    }, [id]);

    return (
        <div>
            {isLoading && (
                <p className="aside">Loading...</p>
            )}
            {!isLoading && (
                <h1 className="heading">{projName}</h1>
            )}
        </div>
    )
}