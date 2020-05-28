import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { format } from 'date-fns';

import "./Project.css";

import ProjectItem from "../components/ProjectItem";
import ProjectNewEvent from "../components/ProjectNewEvent";

export default function Project() {
    const { id } = useParams();
    const history = useHistory();
    const [projName, setProjName] = useState("");
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInit, setIsInit] = useState(false);
    const [showPrivate, setShowPrivate] = useState(true);
    const [numPrivate, setNumPrivate] = useState(0);
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
                        hidden
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
            const sortedEvents = projectData.data.getProject.events.items.sort((a, b) => {
                return new Date(b.time) - new Date(a.time);
            });
            setNumPrivate(sortedEvents.filter(event => event.hidden).length);
            setEvents(sortedEvents);
            setIsLoading(false);
            setIsInit(true);
        }
        catch (e) {
            console.log(e);
        }
    }

    function removeLocal(eventID) {
        setEvents(events.filter(event => event.id !== eventID));
    }

    function changeHiddenLocal(eventID, hide) {
        setNumPrivate(hide ? numPrivate + 1 : numPrivate - 1);
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
                    <h1 className="heading">{projName}</h1>
                    <hr className="sep"></hr>
                    <ProjectNewEvent setEvents={setEvents} events={events} projectId={id}></ProjectNewEvent>
                    <hr className="sep"></hr>

                    {showPrivate ? (
                        <button className="button ml-auto block ~neutral my-4" disabled={numPrivate === 0} onClick={() => setShowPrivate(false)}>Show only public updates</button>
                    ) : (
                        <div className="aside align-center ~info md:flex">
                            <span className="leading-8">Showing only public updates</span>
                                <button className="button ml-auto bg-transparent pl-0 underline" onClick={() => setShowPrivate(true)}>Show {numPrivate} private {numPrivate === 1 ? "update" : "updates"}</button>
                        </div>
                    )}

                    <div className={showPrivate ? "" : "projectsHidePrivate"}>
                    {events.map((event, i, arr) => 
                        (
                                <div key={event.id}>
                                    {
                                    (i === 0 || format(new Date(arr[i - 1].time), "yyyy-MM-dd") !== format(new Date(event.time), "yyyy-MM-dd")) && (
                                        <p className="label my-4">{format(new Date(event.time), "EEEE, MMMM d")}</p>
                                    )
                                }
                                <ProjectItem changeHiddenLocal={changeHiddenLocal} removeLocal={removeLocal} event={event}></ProjectItem>
                            </div>                     
                    ))}
                    </div>
                </>
            )}
        </div>
    )
}