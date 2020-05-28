import React, { useState, useRef } from "react";
import { Storage, API, graphqlOperation } from "aws-amplify";

import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "./ProjectNewEvent.css";

import * as FilePond from "react-filepond";
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import "filepond/dist/filepond.min.css";
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

export default function ProjectNewEvent(props) {
    const [newNote, setNewNote] = useState("Write a new update here...");
    const [newFiles, setNewFiles] = useState([]);

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

    async function handleCreateEvent(e) {
        e.preventDefault();
        console.log(newNote);
        const currentDate = new Date();
        const filenames = `[${newFiles.map(file => `"${file.name}"`)}]`;
        const newNoteQuery = `
mutation {
  createEvent(input: {eventProjectId: "${props.projectId}", time: "${currentDate.toISOString()}", filenames: ${filenames}, note: """${newNote}"""}) {
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
            props.setEvents([newEvent.data.createEvent, ...props.events]);
            setNewNote("");
            setNewFiles([]);
        }
        catch (error) {
            console.warn(error);
        }
    }

    async function handleCancelEvent(e) {
        e.preventDefault();
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
                        Storage.vault.put(file.name, file, {
                            progressCallback(thisProgress) {
                                progress(thisProgress.lengthComputable, thisProgress.loaded, thisProgress.total);
                            }
                        }).then(res => {
                            load(res.key);
                            setCanSubmit(true);
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
                        try {
                            Storage.vault.remove(uniqueFileId)
                                .then(() => load());
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
            ></FilePond.FilePond>
            )}
            
            <div className="flex my-4">
                <button className={`button mr-2 ~neutral ${showNote ? "!low" : "!normal"}`} onClick={() => setShowNote(!showNote)}>{!showNote ? "Add Note" : "Remove Note"}</button>
                <button className={`button mx-2 ~neutral ${showUpload ? "!low" : "!normal"}`} onClick={() => setShowUpload(!showUpload)}>{!showUpload ? "Add Attachments" : "Remove Attachments"}</button>
                <button className={`button mx-2 ~neutral ${showAudio ? "!low" : "!normal"}`} onClick={() => setShowAudio(!showAudio)}>{!showAudio ? "Record Audio" : "Remove Audio"}</button>
                <button className={`button mx-2 ~neutral ${showVideo ? "!low" : "!normal"}`} onClick={() => setShowVideo(!showVideo)}>{!showVideo ? "Record Video" : "Remove Video"}</button>
            </div>
            <hr></hr>
            <div className="flex">
                <button onClick={handleCreateEvent} disabled={!(canSubmit && (showNote || showUpload || showAudio || showVideo))} className="button field w-auto block my-4 mr-2">Create Update</button>
                {(canSubmit && (showNote || showUpload || showAudio || showVideo)) && (<button onClick={handleCancelEvent} className="mx-4 button ~critical !low w-auto block my-2">Cancel</button>)}
                <button onClick={handleCreateEvent} disabled={!(canSubmit && (showNote || showUpload || showAudio || showVideo))} className="mx-4 button ~info !low w-auto block my-2">Create Update & Post to Twitter</button>
            </div>
        </div>
    )
}