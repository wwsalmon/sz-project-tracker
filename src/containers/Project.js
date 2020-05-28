import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { API, graphqlOperation, Auth, Storage } from "aws-amplify";
import { format } from 'date-fns';

import * as Showdown from "showdown";
import Parser from 'html-react-parser';

import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "./Project.css";

import * as FilePond from "react-filepond";
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import "filepond/dist/filepond.min.css";
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import EventImage from "../components/EventImage";

export default function Project() {
    const { id } = useParams();
    const history = useHistory();
    const [projName, setProjName] = useState("");
    const [newNote, setNewNote] = useState("Write a new update here...");
    const [newFiles, setNewFiles] = useState([]);
    const [events, setEvents] = useState([]);
    const [MDEUrl, SetMDEUrl] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isInit, setIsInit] = useState(false);
    const [canSubmit, setCanSubmit] = useState(true);
    const pond = useRef();
    let projectData;


    FilePond.registerPlugin(FilePondPluginImagePreview);

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

    async function handleCreateEvent(e){
        e.preventDefault();
        console.log(newNote);
        const currentDate = new Date();
        const filenames = `[${newFiles.map(file => `"${file.name}"`)}]`;
        const newNoteQuery = `
mutation {
  createEvent(input: {eventProjectId: "${id}", time: "${currentDate.toISOString()}", filenames: ${filenames}, note: """${newNote}"""}) {
    id
    note
    time
    filenames
  }
}
        `
        console.log(newNoteQuery);
        try {
            const newEvent = await API.graphql(graphqlOperation(newNoteQuery));
            setEvents([newEvent.data.createEvent, ...events]);
            setNewNote("");
            setNewFiles([]);
        }
        catch (error) {
            console.warn(error);
        }
    }

    async function handleDeleteEvent(e, eventID, filenames) {
        e.preventDefault();
        const query = `
        mutation{
            deleteEvent(input: {id: "${eventID}"}){ note id }
        }
        `        
        try {
            await API.graphql(graphqlOperation(query));
            setEvents(events.filter(event => event.id !== eventID));
        }
        catch (error) {
            console.log(error);
        }

        for (const filename of filenames){
            try{
                await Storage.vault.remove(filename);
            }
            catch(e){
                console.log(e);
            }
        }
    }

    // breaks a lot of things, just gonna not use it for now
    // async function handleMDEImageUpload(file, onSuccess, onError) {
    //     document.addEventListener("FilePond:processfile", () => {
    //         Storage.vault.get(file.name).then(res => onSuccess(res)).catch(error => onError(error.toString()));
    //     });
    //     pond.current.addFile(file);
    // }

    function handleFilePondInit(){
        console.log("filepond init", pond);
    }

    function handleFilePondUpdate(fileItems){
        setNewFiles(fileItems.map(fileItem => fileItem.file));
    }

    useEffect(() => {
        onLoad();
    }, [id]);

    const markdownConverter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true
    });

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
                    <form onSubmit={handleCreateEvent}>
                        <p className="label my-4">Create New Update</p>
                        <SimpleMDE
                            value={newNote}
                            onChange={setNewNote}
                            options={{
                                spellChecker: false,
                                // uploadImage: true,
                                // imageUploadFunction: handleMDEImageUpload
                            }}
                        />
                        <FilePond.FilePond server={
                            {
                                process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                                    setCanSubmit(false);
                                    try {
                                        Storage.vault.put(file.name, file, {
                                            progressCallback(thisProgress) {
                                                progress(thisProgress.lengthComputable, thisProgress.loaded, thisProgress.total);
                                            }
                                        }).then(res => {
                                            load(res.key);
                                            setCanSubmit(true);
                                        });
                                    } catch (e) {
                                        error(e);
                                        setCanSubmit(true);
                                    }

                                    return {
                                        abort: () => {
                                            abort();
                                            setCanSubmit(true);
                                        }
                                    }
                                },
                                revert: (uniqueFileId, load, error) => {
                                    try {
                                        Storage.vault.remove(uniqueFileId)
                                        .then(() => load());
                                    } catch (e){
                                        error(e);
                                    }
                                }   
                            }
                        }
                            ref={pond}
                            files={newFiles}
                            allowMultiple={true}
                            oninit={handleFilePondInit}
                            onupdatefiles={(fileItems) => handleFilePondUpdate(fileItems)}
                            ></FilePond.FilePond>
                        <input type="submit" value="Create Update" className="button field w-auto block my-4"></input>
                    </form>
                    <hr className="sep"></hr>
                    {events.map((event, i, arr) => (
                        <div key={event.id}>
                            { 
                                (i === 0 || format(new Date(arr[i - 1].time), "yyyy-MM-dd") !== format(new Date(event.time), "yyyy-MM-dd")) && (
                                    <p className="label my-4">{format(new Date(event.time), "EEEE, MMMM d")}</p>
                                )
                            }
                            <hr></hr>
                            <div className="md:flex py-8 hover:bg-gray-100 rounded">
                                <p className="w-32 supra flex-none">{
                                format(new Date(event.time), "h:mm a")
                                }</p>
                                <div className="content">
                                    {Parser(markdownConverter.makeHtml(event.note))}
                                    <div className="flex items-center">
                                        {event.filenames.map(filename => (
                                            <EventImage className="w-32 p-2 hover:bg-gray-200 content-center flex" key={filename} s3key={filename}></EventImage>
                                        ))}
                                    </div>
                                    <button className="button" onClick={(e) => handleDeleteEvent(e, event.id, event.filenames)}>Delete</button>
                                </div>
                            </div>

                        </div>
                    ))}
                </>
            )}
        </div>
    )
}