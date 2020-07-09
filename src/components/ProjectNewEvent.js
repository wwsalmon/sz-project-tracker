import React, { useState, useRef } from "react";
import { Storage, API, graphqlOperation } from "aws-amplify";

import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

import * as FilePond from "react-filepond";
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import "filepond/dist/filepond.min.css";
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import {v1 as uuidv1} from 'uuid';
import utf8 from "utf8";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import ReactTooltip from "react-tooltip";

export default function ProjectNewEvent(props) {
    const defaultNewNote = "Write a new update here...";

    const [newNote, setNewNote] = useState(defaultNewNote);
    const [newFiles, setNewFiles] = useState([]);
    const [fileUUIDs, setFileUUIDs] = useState([]);

    let fasterFileUUIDs = [];

    const [isEdit, setIsEdit] = useState(false);
    const [isPublic, setIsPublic] = useState(false);

    const [canSubmit, setCanSubmit] = useState(true);
    const pond = useRef();

    FilePond.registerPlugin(FilePondPluginImagePreview,
        FilePondPluginFileValidateSize,
        FilePondPluginFileValidateType);

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
              note: """${utf8.encode(newNote)}""",
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
                        note: """${utf8.encode(newNote)}"""}){ id }                         
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
        setNewNote(defaultNewNote);
        setNewFiles([]);
        setFileUUIDs([]);
        setIsPublic(false);
        setIsEdit(false);
    }

    async function handleCreateEventTwitter(e) {
        const createEventStatus = await handleCreateEvent(e);
        if (createEventStatus.status === "success"){
            const twitterUrl = 'https:/twitter.com/intent/tweet?text=';
            const maxTweetLength = 280 - 23 - 5;
            const noteText = newNote.length < maxTweetLength ? encodeURIComponent(newNote + " ") :
                encodeURIComponent(newNote.substring(0,280 - 23 - 5) + "... ");
            const noteUrl = "https://sz-project-tracker-v0.netlify.app/public/"
                + props.publicId + "/" + createEventStatus.publicEventId;
            window.open(twitterUrl + noteText + noteUrl);
        }
    }

    async function handleCancelEvent(e) {
        e.preventDefault();
        if ((newNote === defaultNewNote && newFiles.length === 0) ||
            window.confirm("You have unsaved changes. Are you sure you want to discard them?")){
            for (const filename of fileUUIDs) {
                await Storage.vault.remove(filename);
            }
            setNewNote(defaultNewNote);
            setNewFiles([]);
            setFileUUIDs([]);
            setIsPublic(false);
            setIsEdit(false);
        }
    }

    function handleFilePondUpdate(fileItems) {
        setNewFiles(fileItems.map(fileItem => fileItem.file));
    }

    return isEdit ? (
            <div>
                <hr className="my-8 pt-8"/>
                <h1 className="heading my-8">New Update</h1>
                <SimpleMDE
                    value={newNote}
                    onChange={setNewNote}
                    options={{
                        spellChecker: false,
                        // uploadImage: true,
                        // imageUploadFunction: handleMDEImageUpload
                    }}
                />
                <p className="label my-2">Attach images to update</p>
                <FilePond.FilePond server={
                    {
                        process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                            const extArray = file.name.split('.');
                            const ext = extArray[extArray.length - 1];
                            const uuid = uuidv1() + `.${ext}`;

                            Storage.vault.put(uuid, file, {
                                progressCallback(thisProgress) {
                                    progress(thisProgress.lengthComputable, thisProgress.loaded, thisProgress.total);
                                }
                            }).then(res => {
                                load(res.key);
                                setCanSubmit(true);
                                fasterFileUUIDs.push(uuid);
                                setFileUUIDs([...fileUUIDs, ...fasterFileUUIDs]);
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
                                        fasterFileUUIDs.filter(d => d !== uniqueFileId);
                                        fileUUIDs.filter(d => d !== uniqueFileId);
                                        setFileUUIDs([...fileUUIDs, ...fasterFileUUIDs]);
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
                                   onupdatefiles={(fileItems) => handleFilePondUpdate(fileItems)}
                                   maxFileSize="1MB"
                                   acceptedFileTypes={["image/png", "image/jpeg", "image/jpg", "image/gif"]}
                />
                <div className="overflow-auto">
                    <div className="flex items-center">
                        <button onClick={handleCreateEvent}
                                disabled={!canSubmit}
                                className="button ~info !high w-auto block mr-2">
                            Create Update
                        </button>
                        <button onClick={handleCancelEvent} className="mx-4 button ~critical !low w-auto block my-2">
                            Cancel
                        </button>
                        <label data-tip={props.publicId ? "" : "Make project public to post public updates"}
                               className={`mx-2 ${(canSubmit && props.publicId) ? "cursor-pointer" : "opacity-50"}`}>
                            <input type="checkbox" checked={isPublic}
                                   onChange={e => setIsPublic(e.target.checked)}
                                   disabled={(!canSubmit || !props.publicId)}
                            />
                            <span className="ml-2">Post publicly</span>
                        </label>
                        <button onClick={handleCreateEventTwitter}
                                disabled={!(canSubmit && isPublic && props.publicId)}
                                className="mx-4 button ~info !low w-auto block">
                            Create Update & Post to Twitter
                        </button>
                    </div>
                </div>
                <ReactTooltip/>
            </div>
        ) : (
            <div className="flex justify-center">
                <button className="button ~info !high" onClick={e => {e.preventDefault(); setIsEdit(true)}}>
                    <FontAwesomeIcon icon={faPlus} className="pr-1"/> New update
                </button>
            </div>
        );
}