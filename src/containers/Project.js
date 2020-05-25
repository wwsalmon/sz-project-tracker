import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API, graphqlOperation} from "aws-amplify";

export default function Notes() {
    const { id } = useParams();
    // const history = useHistory();
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

        async function onLoad(){
            try{
                const project = await loadProject();
                setProjName(project.name);
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
            {projName && (
                <h1 className="heading">{projName}</h1>
            )}
        </div>
    )
}