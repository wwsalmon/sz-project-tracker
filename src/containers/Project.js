import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { format } from 'date-fns';

import "./Project.css";

import ProjectItem from "../components/ProjectItem";
import ProjectNewEvent from "../components/ProjectNewEvent";
import MoreButton from "../components/MoreButton";

export default function Project() {
    const { id } = useParams();
    const history = useHistory();
    const [projName, setProjName] = useState("");
    const [events, setEvents] = useState([]);
    const [publicId, setPublicId] = useState(false); // false if private, link if public
    // const [isLoading, setIsLoading] = useState(true);
    const [isInit, setIsInit] = useState(false);
    const [showPrivate, setShowPrivate] = useState(true);
    const [numPrivate, setNumPrivate] = useState(0);

    function removeLocal(eventID) {
        setEvents(events.filter(event => event.id !== eventID));
    }

    function changeHiddenLocal(eventID, hide) {
        setNumPrivate(hide ? numPrivate + 1 : numPrivate - 1);
    }

    async function makePublic(e){
        e.preventDefault();
        const createQuery = `
            mutation {
                createPublicProject(input: {
                    name: "${projName}",
                    publicProjectProjectId: "${id}"
                }){id name project{id}}
            }                    
        `
        API.graphql(graphqlOperation(createQuery)).then(res => {
            const publicProject = res.data.createPublicProject.id;
            const updateProject = `
                mutation{
                    updateProject(input: {id: "${id}", projectPublicProjectId: "${publicProject}", public: true}){
                        public publicProject{
                            id
                        }
                    }
                }
            `
            API.graphql(graphqlOperation(updateProject)).then(res => {
                console.log(res);
                setPublicId(publicProject);
            }).catch(e => console.log(e));
        }).catch(e => console.log(e));
    }

    async function makePrivate(e){
        e.preventDefault();
        const deleteQuery = `
            mutation {
                deletePublicProject(input: {id: "${publicId}"}){id name}
                updateProject(input: {id: "${id}", public: false}){ public }
            }                    
        `
        API.graphql(graphqlOperation(deleteQuery)).then(() => {
            setPublicId(false);
        })
            .catch(e => console.log(e))
    }

    async function deleteProject(e) {
        e.preventDefault();
        const deleteQuery = `
            mutation {
                deleteProject(input: {
                    id: "${id}"
                }){
                    name id
                }
            }
        `
        API.graphql(graphqlOperation(deleteQuery)).then(() => {
            history.push("/projects", {projectDeleted: true}); // add "project deleted" prop
        }).catch(e => console.log(e));
    }

    async function renameProject(e) {
        e.preventDefault();
        const renameQuery = `
            mutation {
                updateProject(input: {
                    id: "${id}",
                    name: "${projName}
                }){
                    id
                }
            }
        `
        API.graphql(graphqlOperation(renameQuery)).then(res => {
            console.log(res); // add "project deleted" prop
        }).catch(e => console.log(e));
    }

    useEffect(() => {
        let projectData;

        function loadProject() {
            const query = `
        query {
            getProject(id: "${id}") {
                id
                name
                public
                events{
                    items{
                        id
                        note
                        filenames
                        time
                        hidden
                        publicEvent{
                            id
                        }
                    }
                }
                publicProject{
                    id        
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
                if (projectData.data.getProject.public){
                    setPublicId(projectData.data.getProject.publicProject.id)
                } else setPublicId(false);
                const sortedEvents = projectData.data.getProject.events.items.sort((a, b) => {
                    return new Date(b.time) - new Date(a.time);
                });
                setNumPrivate(sortedEvents.filter(event => event.hidden).length);
                setEvents(sortedEvents);
                // setIsLoading(false);
                setIsInit(true);
            }
            catch (e) {
                console.log(e);
            }
        }
        
        onLoad();
    }, [id, history]);

    return (
        <div className="relative">
            {/* {isLoading && (
                <p className="aside ~info">Loading...</p>
            )} */}
            {isInit && (
                <>
                    <h1 className="heading">{projName}</h1>
                    <MoreButton className="right-0 top-0">
                        <button className="hover:bg-gray-100 py-2 px-4 text-left" onClick={renameProject}>Rename Project</button>
                        <button className="hover:bg-gray-100 py-2 px-4 text-left" onClick={deleteProject}>Delete Project</button>
                        <button className="hover:bg-gray-100 py-2 px-4 text-left" onClick={publicId ? makePrivate : makePublic}>
                            {publicId ? "Make private" : "Make public"}
                        </button>
                    </MoreButton>
                    <p className="badge ~neutral !normal mt-4">{publicId ? `Public id: ${publicId}` : "Private project"}</p>
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