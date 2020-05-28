import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { format } from 'date-fns';

import ProjectItem from "../components/ProjectItem";
import ProjectNewEvent from "../components/ProjectNewEvent";

export default function Project() {
    const { id } = useParams();
    const history = useHistory();
    const [projName, setProjName] = useState("");
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInit, setIsInit] = useState(false);
    let projectData;

    function loadProject() {
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
                    }
                }
            }
        }
    `
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

        try {
            projectData = await loadProject();
            setProjName(projectData.data.getProject.name);
            const sortedEvents = projectData.data.getProject.events.items.sort((a,b)=>{
                return new Date(b.time) - new Date(a.time);
            });
            setEvents(sortedEvents);
            setIsLoading(false);
            setIsInit(true);
        }
        catch (e) {
            console.log(e);
        }
    }

    function removeLocal(eventID){
        setEvents(events.filter(event => event.id !== eventID));
    }

    // breaks a lot of things, just gonna not use it for now
    // async function handleMDEImageUpload(file, onSuccess, onError) {
    //     document.addEventListener("FilePond:processfile", () => {
    //         Storage.vault.get(file.name).then(res => onSuccess(res)).catch(error => onError(error.toString()));
    //     });
    //     pond.current.addFile(file);
    // }

    useEffect(() => {
        onLoad();
    }, [id]);

    return (
        <div>
            {/* {isLoading && (
                <p className="aside ~info">Loading...</p>
            )} */}
            {isInit && (
                <>
                    <Link to="/projects"><button className="button ~neutral !normal my-4">Back to all projects</button></Link>
                    <h1 className="heading">{projName}</h1>
                    <hr className="sep"></hr>
                    <ProjectNewEvent setEvents={setEvents} events={events} projectId={id}></ProjectNewEvent>
                    <hr className="sep"></hr>
                    {events.map((event, i, arr) => (
                        <div key={event.id}>
                            { 
                                (i === 0 || format(new Date(arr[i - 1].time), "yyyy-MM-dd") !== format(new Date(event.time), "yyyy-MM-dd")) && (
                                    <p className="label my-4">{format(new Date(event.time), "EEEE, MMMM d")}</p>
                                )
                            }
                            <hr></hr>
                            <ProjectItem removeLocal={removeLocal} event={event}></ProjectItem>
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}