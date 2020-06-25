import React, { useState, useRef } from "react";
import { Storage, API, graphqlOperation } from "aws-amplify";

import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "./ProjectNewEvent.css";

import * as FilePond from "react-filepond";
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import "filepond/dist/filepond.min.css";
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import {v1 as uuidv1} from 'uuid';

export default function ProjectNewEvent(props) {
    const [newNote, setNewNote] = useState("Write a new update here...");
    const [newFiles, setNewFiles] = useState([]);
    const [fileUUIDs, setFileUUIDs] = useState([]);
    const [isPublic, setIsPublic] = useState(false);

    const [showNote, setShowNote] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [showAudio, setShowAudio] = useState(false);
    const [showVideo, setShowVideo] = useState(false);

    const [canSubmit, setCanSubmit] = useState(true);
    const pond = useRef();

    FilePond.registerPlugin(FilePondPluginImagePreview);

    document.addEventListener("FilePond:addfile", () => {
        setCanSubmit(false);
    });

    /*
    process all the input
    create a private event

    if isPublic
    get the private id
    create a public event
    get the public id
    update the private event
    */
    async function handleCreateEvent(e) {
        e.preventDefault();
        const currentDate = new Date();
        const newFileUUIDs = `[${fileUUIDs.map(d => `"${d}"`)}]`;
        const newNoteQuery = `
        mutation {
          createEvent(input: {
              eventProjectId: "${props.projectId}",
              time: "${currentDate.toISOString()}",
              filenames: ${newFileUUIDs},
              note: """${newNote}""",
              hidden: ${!isPublic}}) {
                id
                note
                time
                filenames
                hidden
                publicEvent{
                    id
                }
                project{
                    publicProject{
                        id
                    }
                }
          }
        }`;

        try{
            if (isPublic && !props.publicId) throw new Error("Can't create public update, project is private");
            const createPrivateData = await API.graphql(graphqlOperation(newNoteQuery));
            if (isPublic){
                const privateEventId = createPrivateData.data.createEvent.id;
                const publicProjectId = props.publicId;
                const createPublicQuery = `
                mutation{
                   createPublicEvent(input: {
                        publicEventEventId: "${privateEventId}",
                        publicEventPublicProjectId: "${publicProjectId}",
                        time: "${currentDate.toISOString()}",
                        filenames: ${newFileUUIDs},
                        note: """${newNote}"""}){ id }                         
                }`;
                const publicEventData = await API.graphql(graphqlOperation(createPublicQuery));
                const publicEventId = publicEventData.data.createPublicEvent.id;
                const updatePrivateQuery = `
                mutation{
                    updateEvent(input: {
                        id: "${privateEventId}",
                        eventPublicEventId: "${publicEventId}"
                    }){
                        id
                        note
                        time
                        filenames
                        hidden
                        publicEvent{
                            id
                        }
                        project{
                            publicProject{
                                id
                            }
                        }
                    }
                }`;
                return new Promise(resolve => {
                    API.graphql(graphqlOperation(updatePrivateQuery)).then(res => {
                        afterCreateEvent(res.data.updateEvent);
                        resolve({"status": "success", "publicEventId": publicEventId});
                    });
                });
            } else{
                afterCreateEvent(createPrivateData.data.createEvent);
                return new Promise(resolve => {resolve({"status": "success"})});
            }
        } catch(e){
            return new Promise(resolve => {
                resolve({"status": "failure", "error": e});
            });
        }

    }

    function afterCreateEvent(eventObj){
        props.setEvents([eventObj, ...props.events]);
        setNewNote("Write a new update here...");
        setNewFiles([]);
        setIsPublic(false);
        setShowNote(false);
        setShowUpload(false);
        setShowAudio(false);
        setShowVideo(false);
    }

    async function handleCreateEventTwitter(e) {
        const createEventStatus = await handleCreateEvent(e);
        if (createEventStatus.status === "success"){
            const twitterUrl = 'https:/twitter.com/intent/tweet?text=';
            const maxTweetLength = 280 - 23 - 5;
            const noteText = newNote.length < maxTweetLength ? encodeURI(newNote + " ") :
                encodeURI(newNote.substring(0,280 - 23 - 5) + "... ");
            const noteUrl = "https://sz-project-tracker-v0.netlify.app/public/"
                + props.publicId + "/" + createEventStatus.publicEventId;
            window.open(twitterUrl + noteText + noteUrl);
        }
    }

    function handleCancelEvent(e) {
        e.preventDefault();
        setIsPublic(false);
        setShowNote(false);
        setShowUpload(false);
        setShowAudio(false);
        setShowVideo(false);
    }

    function handleFilePondInit() {
        console.log("filepond init", pond);
    }

    function handleFilePondUpdate(fileItems) {
        setNewFiles(fileItems.map(fileItem => fileItem.file));
    }

    return (
        <div>
            <p className="label my-4">Create New Update</p>
            {showNote && (
                <SimpleMDE
                    value={newNote}
                    onChange={setNewNote}
                    options={{
                        spellChecker: false,
                        // uploadImage: true,
                        // imageUploadFunction: handleMDEImageUpload
                    }}
                />
            )}
            {showUpload && (
            <FilePond.FilePond server={
                {
                    process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                        const extArray = file.name.split('.');
                        const ext = extArray[extArray.length - 1];
                        console.log(ext);
                        const uuid = uuidv1() + `.${ext}`;

                        Storage.vault.put(uuid, file, {
                            progressCallback(thisProgress) {
                                progress(thisProgress.lengthComputable, thisProgress.loaded, thisProgress.total);
                            }
                        }).then(res => {
                            load(res.key);
                            setCanSubmit(true);
                            setFileUUIDs([...fileUUIDs, uuid]);
                        }).catch(e => {
                            console.log(e);
                            error(e);
                            setCanSubmit(true);
                        });

                        return {
                            abort: () => {
                                abort();
                                setCanSubmit(true);
                            }
                        }
                    },
                    revert: (uniqueFileId, load, error) => {
                        console.log(uniqueFileId);
                        try {
                            Storage.vault.remove(uniqueFileId)
                                .then(() => {
                                    setFileUUIDs(fileUUIDs.filter(d => d !== uniqueFileId));
                                    load();
                                });
                        } catch (e) {
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
            />
            )}
            <div className="overflow-auto">
                <div className="flex my-4">
                    <button className={`button mr-2 ~neutral ${showNote ? "!low" : "!normal"}`} onClick={() => setShowNote(!showNote)}>{!showNote ? "Add Note" : "Remove Note"}</button>
                    <button className={`button mx-2 ~neutral ${showUpload ? "!low" : "!normal"}`} onClick={() => setShowUpload(!showUpload)}>{!showUpload ? "Add Attachments" : "Remove Attachments"}</button>
                    {/* <button className={`button mx-2 ~neutral ${showAudio ? "!low" : "!normal"}`} onClick={() => setShowAudio(!showAudio)}>{!showAudio ? "Record Audio" : "Remove Audio"}</button>
                    <button className={`button mx-2 ~neutral ${showVideo ? "!low" : "!normal"}`} onClick={() => setShowVideo(!showVideo)}>{!showVideo ? "Record Video" : "Remove Video"}</button> */}
                    <label className={`mx-2 my-2 ${(canSubmit && props.publicId && (showNote || showUpload || showAudio || showVideo)) ? "" : "opacity-50"}`}>
                        <input type="checkbox" checked={isPublic}
                               onChange={e => setIsPublic(e.target.checked)}
                               disabled={!(canSubmit && props.publicId && (showNote || showUpload || showAudio || showVideo))}
                        />
                        <span className="ml-2">Post publicly</span>
                    </label>
                </div>
            </div>
            <hr></hr>
            <div className="overflow-auto">
                <div className="flex">
                    <button onClick={handleCreateEvent}
                            disabled={!(canSubmit && (showNote || showUpload || showAudio || showVideo))}
                            className="button field w-auto block my-4 mr-2">Create Update</button>
                    {(canSubmit && (showNote || showUpload || showAudio || showVideo)) && (
                        <button onClick={handleCancelEvent} className="mx-4 button ~critical !low w-auto block my-2">
                            Cancel
                        </button>
                    )}
                    <button onClick={handleCreateEventTwitter}
                            disabled={!(canSubmit && isPublic && props.publicId &&
                                (showNote || showUpload || showAudio || showVideo))}
                            className="mx-4 button ~info !low w-auto block my-2">
                        Create Update & Post to Twitter
                    </button>
                </div>
            </div>
        </div>
    )
}
