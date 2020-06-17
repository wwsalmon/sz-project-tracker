import { API, graphqlOperation } from "aws-amplify";

export function loadProject(id) {
    const query = `
        query {
            getProject(id: "${id}") {
                id
                name
                events{
                    items{
                        id
                        note
                        filenames
                        time
                        hidden
                    }
                }
            }
        }
    `
    return API.graphql(graphqlOperation(query));
}