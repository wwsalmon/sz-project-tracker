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
    const [MDEUrl, SetMDEUrl] = useState("");
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

    function handleFilePondInit() {
        console.log("filepond init", pond);
    }

    function handleFilePondUpdate(fileItems) {
        setNewFiles(fileItems.map(fileItem => fileItem.file));
    }

    return (
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
            <button type="submit" disabled={!canSubmit} value="Create Update" className="button field w-auto block my-4">Create Update</button>
        </form>
    )
}