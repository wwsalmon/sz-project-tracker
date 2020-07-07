import React, {useEffect, useState} from "react";
import {useParams, useHistory, Link} from "react-router-dom";
import {API, graphqlOperation} from "aws-amplify";
import {format} from 'date-fns';
import {useAuth} from "../lib/authLib";
import utf8 from "utf8";

import "./Project.css";
import {saveAs} from 'file-saver';

import ProjectItem from "../components/ProjectItem";
import ProjectNewEvent from "../components/ProjectNewEvent";
import MoreButton from "../components/MoreButton";

import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

import * as Showdown from "showdown";
import Parser from 'html-react-parser';
import {faEye} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Helmet} from "react-helmet";
import getTitle from "../lib/getTitle";

export default function Project() {
    const {id} = useParams();
    const history = useHistory();
    const [projName, setProjName] = useState("");
    const [projDescript, setProjDescript] = useState("");
    const [newProjName, setNewProjName] = useState("");
    const [newProjDescript, setNewProjDescript] = useState("");
    const [events, setEvents] = useState([]);
    const [publicId, setPublicId] = useState(false); // false if private, link if public
    // const [isLoading, setIsLoading] = useState(true);
    const [isInit, setIsInit] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [sortNew, setSortNew] = useState(true);
    const [showPrivate, setShowPrivate] = useState(true);
    const [numPrivate, setNumPrivate] = useState(0);
    const auth = useAuth();

    function removeLocal(eventID) {
        setEvents(events.filter(event => event.id !== eventID));
    }

    function changeHiddenLocal(eventID, hide) {
        setNumPrivate(hide ? numPrivate + 1 : numPrivate - 1);
    }

    async function makePublic(e) {
        e.preventDefault();
        const createQuery = `
            mutation {
                createPublicProject(input: {
                    name: "${projName}",
                    description: "${utf8.encode(projDescript)}",
                    publicProjectProjectId: "${id}"
                }){id name project{id}}
            }                    
        `
        API.graphql(graphqlOperation(createQuery)).then(res => {
            const publicProject = res.data.createPublicProject.id;
            const updateProject = `
                mutation{
                    updateProject(input: {
                        id: "${id}",
                        projectPublicProjectId: "${publicProject}",
                        public: true
                    }){public publicProject{id}}
                }
            `
            API.graphql(graphqlOperation(updateProject)).then(res => {
                console.log(res);
                setPublicId(publicProject);
            }).catch(e => console.log(e));
        }).catch(e => console.log(e));
    }

    async function makePrivate(e) {
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
        try {
            const deleteReq = `
            mutation {
                deleteProject(input: {
                    id: "${id}"
                }){
                    public publicProject{ id }
                }
            }`;
            const deleteData = await API.graphql(graphqlOperation(deleteReq));
            if (deleteData.data.deleteProject.public) {
                const deletePublicReq = `
                mutation{
                    deletePublicProject(input: {
                        id: "${deleteData.data.deleteProject.publicProject.id}"
                    }){ id }
                }`;
                await API.graphql(graphqlOperation(deletePublicReq));
            }
            history.push("/projects", {projectDeleted: true});
        } catch (e) {
            console.log(e);
        }
    }

    async function exportProject(e) {
        let JSONobj = {"projectid": id, "name": projName, "public": publicId, "events": events};
        let JSONtext = JSON.stringify(JSONobj);
        let blob = new Blob([JSONtext], {type: "text/plain;charset=utf-8"});
        saveAs(blob, projName + ".json");
    }

    async function editProjectInfo() {
        let editQuery = `
            mutation {
                updateProject(input: {
                    id: "${id}",
                    name: "${newProjName}",
                    description: "${newProjDescript}"
                }){
                    id name
                }           
        `;
        editQuery += publicId ? `
                updatePublicProject(input: {
                    id: "${publicId}",
                    name: "${newProjName}",
                    description: "${newProjDescript}"
                }){
                    id
                }
        ` : "";
        editQuery += "}";
        API.graphql(graphqlOperation(editQuery)).then(res => {
            setProjName(newProjName);
            setProjDescript(newProjDescript);
            setIsEdit(false);
            console.log(res); // add "project deleted" prop
        }).catch(e => console.log(e));
    }

    function cancelEditProjectInfo(e) {
        e.preventDefault();
        if (newProjDescript === projDescript && newProjName === projName) {
            setIsEdit(false);
        } else {
            if (window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
                setNewProjName(projName);
                setNewProjDescript(projDescript);
                setIsEdit(false);
            }
        }
    }

    useEffect(() => {
        let projectData;

        function loadProject() {
            const query = `
        query {
            getProject(id: "${id}") {
                id
                name
                description
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
            if (auth.authState !== "signedIn") {
                history.push({pathname: "/login", state: {message: "You must be logged in to edit projects."}});
                return;
            }

            try {
                projectData = await loadProject();
                const decodedDescript = projectData.data.getProject.description;
                const dataProjName = projectData.data.getProject.name;
                setProjName(dataProjName);
                setNewProjName(dataProjName);
                setProjDescript(decodedDescript);
                setNewProjDescript(decodedDescript);

                if (projectData.data.getProject.public) {
                    setPublicId(projectData.data.getProject.publicProject.id)
                } else setPublicId(false);

                const sortedEvents = projectData.data.getProject.events.items.sort((a, b) => {
                    return new Date(b.time) - new Date(a.time);
                });

                setNumPrivate(sortedEvents.filter(event => event.hidden).length);
                setEvents(sortedEvents);
                // setIsLoading(false);
                setIsInit(true);
            } catch (e) {
                console.log(e);
            }
        }

        onLoad();
    }, [id, history, auth.authState]);

    const markdownConverter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true
    });

    return (
        <div className="relative">
            <Helmet>
                <title>{getTitle(projName)}</title>
            </Helmet>
            {/* {isLoading && (
                <p className="aside ~info">Loading...</p>
            )} */}
            <div className="text-center">
                <p className="label mb-4"><Link to="/projects">&lt; Back to all projects</Link></p>
            </div>
            {isInit && (
                <>
                    <div className="text-center">
                        {isEdit ? (
                            <input type="text" className="field heading block max-w-2xl w-full mx-auto"
                                   value={newProjName} onChange={e => setNewProjName(e.target.value)}/>
                        ) : (
                            <h1 className="heading">{projName}</h1>
                        )}
                        {publicId ? (
                            <p className="content aside ~neutral !normal mt-8">
                                This is a public project. Public updates are published at <Link
                                to={`/public/${publicId}`} target="_blank">{publicId}</Link>.
                            </p>
                        ) : (
                            <p className="badge ~neutral !normal mt-4">Private project</p>
                        )}
                    </div>
                    {isEdit ? (
                        <>
                            <SimpleMDE
                                value={newProjDescript}
                                onChange={setNewProjDescript}
                                options={{
                                    spellChecker: false,
                                }}
                                className="mt-4 max-w-2xl mx-auto"
                            />
                            <div className="flex max-w-2xl mx-auto">
                                <button onClick={editProjectInfo}
                                        disabled={(newProjDescript === projDescript && newProjName === projName)}
                                        className="button field w-auto block my-4 mr-2">Save Changes
                                </button>
                                <button onClick={cancelEditProjectInfo}
                                        className="button field ~warning !low w-auto block my-4 mr-2">Cancel Edit
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="max-w-2xl my-4 mx-auto text-center">
                            {projDescript !== null ? Parser(markdownConverter.makeHtml(projDescript)) : (
                                <p className="opacity-50">Set a project description or change the project name by
                                    clicking the three dots on the right and clicking "edit project info."</p>
                            )}
                        </div>
                    )}
                    <MoreButton className="right-0 top-0">
                        {!isEdit && (
                            <button className="hover:bg-gray-100 py-2 px-4 text-left" onClick={() => {
                                setIsEdit(!isEdit)
                            }}>Edit Project Info</button>
                        )}
                        <button className="hover:bg-gray-100 py-2 px-4 text-left" onClick={deleteProject}>Delete
                            Project
                        </button>
                        <button className="hover:bg-gray-100 py-2 px-4 text-left" onClick={exportProject}>Export
                            Project
                        </button>
                        <button className="hover:bg-gray-100 py-2 px-4 text-left"
                                onClick={publicId ? makePrivate : makePublic}>
                            {publicId ? "Make private" : "Make public"}
                        </button>
                    </MoreButton>
                    <hr className="sep"/>
                    <ProjectNewEvent setEvents={setEvents} publicId={publicId} events={events} projectId={id}/>
                    <hr className="sep"/>

                    {showPrivate ? (
                        <button className="button ml-auto block ~neutral my-4" disabled={numPrivate === 0}
                                onClick={() => setShowPrivate(false)}>
                            <FontAwesomeIcon icon={faEye} className="pr-1"/> Show only public updates
                        </button>
                    ) : (
                        <div className="aside align-center ~info md:flex">
                            <span className="leading-8">Showing only public updates</span>
                            <button className="button ml-auto bg-transparent pl-0 underline"
                                    onClick={() => setShowPrivate(true)}>Show {numPrivate} private {numPrivate === 1 ? "update" : "updates"}</button>
                        </div>
                    )}

                    <div className="flex justify-end items-center my-4">
                        <p className="mr-4 opacity-50">{sortNew ? "Sorting by newest first" : "Sorting by oldest first"}</p>
                        <button className="button block ~neutral"
                                onClick={() => setSortNew(!sortNew)}>
                            Toggle sorting
                        </button>
                    </div>

                    <div className={showPrivate ? "" : "projectsHidePrivate"}>
                        {(sortNew ? events : events.slice(0).reverse()).map((event, i, arr) =>
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