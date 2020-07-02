import React, {useEffect, useRef, useState} from "react";
import {useParams, useHistory, Link} from "react-router-dom";
import { API, graphqlOperation } from "aws-amplify";
import { format } from 'date-fns';
import {useAuth} from "../lib/authLib";

import "./Project.css";
import { saveAs } from 'file-saver';

import ProjectItem from "../components/ProjectItem";
import ProjectNewEvent from "../components/ProjectNewEvent";
import MoreButton from "../components/MoreButton";
import Modal from "../components/Modal";

export default function Project() {
    const { id } = useParams();
    const history = useHistory();
    const [projName, setProjName] = useState("");
    const [newProjName, setNewProjName] = useState("");
    const [events, setEvents] = useState([]);
    const [publicId, setPublicId] = useState(false); // false if private, link if public
    // const [isLoading, setIsLoading] = useState(true);
    const [isInit, setIsInit] = useState(false);
    const [showPrivate, setShowPrivate] = useState(true);
    const [numPrivate, setNumPrivate] = useState(0);
    const auth = useAuth();

    const renameModal = useRef();

    function removeLocal(eventID) {
        setEvents(events.filter(event => event.id !== eventID));
    }

    function changeHiddenLocal(eventID, hide) {
        setNumPrivate(hide ? numPrivate + 1 : numPrivate - 1);
    }

    function closeRenameModal(){
        renameModal.current.closeModal();
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

    async function exportProject(e)
    {
        

        let JSONobj={"projectid":id, "name":projName,"public":publicId,"events":events};
        let JSONtext=JSON.stringify(JSONobj);
        let blob=new Blob([JSONtext],{type: "text/plain;charset=utf-8"});
        saveAs(blob,projName+".json");
    }   
    async function renameProject(e) {
        e.preventDefault();
        const renameQuery = `
            mutation {
                updateProject(input: {
                    id: "${id}",
                    name: "${newProjName}"
                }){
                    id name
                }
            }
        `
        API.graphql(graphqlOperation(renameQuery)).then(res => {
            setProjName(newProjName);
            setNewProjName("");
            closeRenameModal();
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
                        project{
                            publicProject{
                                id
                            }
                        }
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
            if (auth.authState !== "signedIn"){
                history.push({pathname: "/login", state: {message: "You must be logged in to edit projects."}});
                return;
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
    }, [id, history, auth.authState]);

    return (
        <div className="relative">
            {/* {isLoading && (
                <p className="aside ~info">Loading...</p>
            )} */}
            {isInit && (
                <>
                    <div className="text-center">
                        <p className="label mb-4"><Link to="/projects">&lt; Back to all projects</Link></p>
                        <h1 className="heading">{projName}</h1>
                        {publicId ? (
                            <p className="content aside ~neutral !normal mt-8">
                                This is a public project. Public updates are published at <Link
                                to={`/public/${publicId}`} target="_blank">{publicId}</Link>.
                            </p>
                        ) : (
                            <p className="badge ~neutral !normal mt-4">Private project</p>
                        )}
                    </div>
                    <MoreButton className="right-0 top-0">
                        <Modal buttonClassName="hover:bg-gray-100 py-2 px-4 text-left"
                                buttonText="Rename Project"
                                ref={renameModal}>
                            <p className="my-4">Enter a new name for this project:</p>
                            <input type="text"
                                   className="field ~neutral !normal my-1"
                                    value={newProjName}
                                    onChange={e => setNewProjName(e.target.value)}/>
                            <div className="my-4">
                                <button className="button ~info !normal"
                                onClick={renameProject}>Rename project</button>
                                <button className="button ~neutral !low opacity-50"
                                onClick={closeRenameModal}>Cancel</button>
                            </div>
                        </Modal>
                        <button className="hover:bg-gray-100 py-2 px-4 text-left" onClick={deleteProject}>Delete Project</button>
                        <button className="hover:bg-gray-100 py-2 px-4 text-left" onClick={exportProject}>Export Project</button>
                        <button className="hover:bg-gray-100 py-2 px-4 text-left" onClick={publicId ? makePrivate : makePublic}>
                            {publicId ? "Make private" : "Make public"}
                        </button>
                    </MoreButton>
                    <hr className="sep"/>
                    <ProjectNewEvent setEvents={setEvents} publicId={publicId} events={events} projectId={id}/>
                    <hr className="sep"/>

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
                                <ProjectItem changeHiddenLocal={changeHiddenLocal}
                                             removeLocal={removeLocal}
                                             event={event}
                                             publicId={publicId}
                                />
                            </div>                     
                    ))}
                    </div>
                </>
            )}
        </div>
    )
}