import {API, graphqlOperation, Storage} from "aws-amplify";

export async function deleteProject(projectId, publicId, events, callback = () => {}){
    try {
        for (const event of events){
            await deleteEvent(event);
        }
        const deleteReq = `
            mutation {
                deleteProject(input: {
                    id: "${projectId}"
                }){ id }
            ` + (publicId ? `
                deletePublicProject(input: {
                    id: "${publicId}"
                }){ id }
            ` : "")
            + "}";
        await API.graphql(graphqlOperation(deleteReq));
        callback();
    } catch (e) {
        console.log(e);
    }
}

export async function deleteEvent(event, callback = () => {}){
    const query = `
        mutation{
            deleteEvent(input: {id: "${event.id}"}){ id }`
        + (event.publicEvent ? `deletePublicEvent(input: {id: "${event.publicEvent.id}"}){ id }` : "") + "}";

    try{
        await API.graphql(graphqlOperation(query));

        for (const filename of event.filenames) {
            try {
                await Storage.vault.remove(filename);
            } catch (e) {
                console.log(e);
            }
        }

        callback();
    } catch (e) {
        console.log(e);
    }
}
