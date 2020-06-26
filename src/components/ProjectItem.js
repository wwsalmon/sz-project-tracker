
import React, {useState, useRef} from "react";
import { API, graphqlOperation, Storage } from "aws-amplify";
import { format } from 'date-fns';

import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "./ProjectNewEvent.css";

import * as Showdown from "showdown";
import Parser from 'html-react-parser';

import * as FilePond from "react-filepond";
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import "filepond/dist/filepond.min.css";
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import {v1 as uuidv1} from 'uuid';


import EventImage from "../components/EventImage";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

import MoreButton from "../components/MoreButton";

export default function ProjectItem(props) {
    const event = props.event;
    const [isPrivate, setIsPrivate] = useState(event.hidden);
    const [newUploads, setNewUploads] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [newNote, setNewNote] = useState(event.note);
    const [publicId, setPublicId] = useState((event.publicEvent === null || event.publicEvent === undefined) ? false : event.publicEvent.id);
    const removeLocal = props.removeLocal;
    const changeHiddenLocal = props.changeHiddenLocal;
    const [showUpload, setShowUpload] = useState(false);
    const [canSubmit, setCanSubmit] = useState(true);
    const [fileUUIDs, setFileUUIDs] = useState([]);
    const [newFiles, setNewFiles] = useState([]);


    const pond =useRef();

    function handleFilePondInit() {
        console.log("filepond init", pond);
    }

    function handleFilePondUpdate(fileItems) {
        setNewFiles(fileItems.map(fileItem => fileItem.file));
        console.log(fileItems.toString());
    }


    async function handleDeleteEvent(e) {
        e.preventDefault();
        const query = `
        mutation{
            deleteEvent(input: {id: "${event.id}"}){ id }
        }
        `
        try {
            await API.graphql(graphqlOperation(query));
            removeLocal(event.id);
        }
        catch (error) {
            console.log(error);
        }

        for (const filename of event.filenames) {
            try {
                await Storage.vault.remove(filename);
            }
            catch (e) {
                console.log(e);
            }
        }
    }

    async function handleToggleHidden(e) {
        e.preventDefault();

        /*

        private -> public:
        update private event and get public project id
        create new public event with all info of private event
        update private event to link to public event

        public -> private:
        update private event and get link to public event
        delete public event

        */

        try{

            if (isPrivate){ // private -> public
                const newFileUUIDs = `[${event.filenames.map(d => `"${d}"`)}]`;
                const updateEventQ1 = `
                    mutation{
                        updateEvent(input: {id: "${event.id}", hidden: false}){
                            hidden project { publicProject{ id } }
                        }
                    }
                `;
                const update1Data = await API.graphql(graphqlOperation(updateEventQ1));
                console.log(update1Data);
                const publicProjectId = update1Data.data.updateEvent.project.publicProject.id;
                // if (publicProjectId === undefined) throw "Project is not public, failed to make update public";
                const createPublicEventQ = `
                    mutation{
                        createPublicEvent(input: {filenames: ${newFileUUIDs}, note: """${newNote}""", time: "${event.time}", publicEventPublicProjectId: "${publicProjectId}"}){ id filenames note time publicProject { id }}
                    }    
                `
                const createPublicData = await API.graphql(graphqlOperation(createPublicEventQ));
                const publicEventId = createPublicData.data.createPublicEvent.id;
                const updateEventQ2 = `
                    mutation{
                        updateEvent(input: {id: "${event.id}", eventPublicEventId: "${publicEventId}"}){
                            publicEvent { id }
                        }
                    }
                `
                await API.graphql(graphqlOperation(updateEventQ2));
                setPublicId(publicEventId);
            } else { // public -> private
                const updateEventQ = `
                    mutation{
                        updateEvent(input: {id: "${event.id}", hidden: true}){
                            hidden publicEvent{ id }
                        }
                    }                    
                `
                const updateData = await API.graphql(graphqlOperation(updateEventQ))
                const publicEventData = updateData.data.updateEvent.publicEvent;
                if (publicEventData === null){
                    console.warn( "No public event found for this event.");
                } else{
                    const publicEventId = publicEventData.id;
                    const deletePublicEventQ = `
                    mutation{
                        deletePublicEvent(input: {id: "${publicEventId}"}){ id }
                    }
                `
                    await API.graphql(graphqlOperation(deletePublicEventQ));
                    setPublicId(false);
                }
            }
            setIsPrivate(!isPrivate);
            changeHiddenLocal(event.id, !isPrivate);
        } catch(e){
            console.log(e);
        }
    }

    function handleToggleEdit(e){
        e.preventDefault();
        setIsEdit(true);
    }
    

    function deleteAttachment(filename)
    {   
        var str="";
        console.log(event.filenames);
        const index = event.filenames.indexOf(filename);
                if (index > -1) {
                event.filenames.splice(index, 1);
                                }
        console.log(event.filenames);
        event.filenames.map(filename =>{str=str+'"';str=str+filename;str=str+'"';str=str+','});
        var newstr= str.substring(0,str.length-1);
        let query = `
        mutation{
            updateEvent(
                input: {
                    id: "${event.id}",
                    filenames : [ ${newstr} ]  
                }
                    )
            { id }
        }`
        
        API.graphql(graphqlOperation(query)).then(res => {
            console.log(res);
        }).catch(e => console.log(e));
        try{
            Storage.vault.remove(filename);
            setIsEdit(false);
        }
        catch(e)
        {
            console.log(e);
        }
    }

    async function handleEditEvent(e){
        e.preventDefault();
        let query = `
        mutation{
            updateEvent(input: {id: "${event.id}", note: """${newNote}"""}){ id }`
            query += publicId ? `updatePublicEvent(input: {id: "${publicId}", note: """${newNote}"""}){ id }` : "";
        query += "}";
        API.graphql(graphqlOperation(query)).then(res => {
            console.log(res);
            event.note = newNote;
            setIsEdit(false);
        }).catch(e => console.log(e));
    }

    function handleCancelEdit(e){
        e.preventDefault();
        if (newNote !== event.note){
            if (window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
                setNewNote(event.note);
                setIsEdit(false);
            }
        }
        else {
            setNewNote(event.note);
            setIsEdit(false);
        }        
    }

    const markdownConverter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true
    });

    return (
        <div className={isPrivate ? "projectItemPrivate" : ""}>
            <hr></hr>
            <div className={`md:flex py-8 ${isPrivate ? "hover:bg-gray-100" : "hover:bg-blue-100"} rounded relative`}>
                <div className="w-32 flex-none flex md:block mb-4 md:mb-0">
                    <p className="supra">{
                        format(new Date(event.time), "h:mm a")
                    }</p>
                    {!isPrivate && (<FontAwesomeIcon className="text-blue-400 ml-2 md:ml-0 md:my-4" icon={faGlobe}></FontAwesomeIcon>)}
                </div>
                <div className="content mr-6 md:mr-0 flex-1">
                    {isEdit ? (
                        <>
                            <SimpleMDE
                                value={newNote}
                                onChange={setNewNote}
                                options={{
                                    spellChecker: false,
                                    // uploadImage: true,
                                    // imageUploadFunction: handleMDEImageUpload
                                }}
                            />
                            <div className="flex">
                                <button onClick={handleEditEvent} disabled={newNote === event.note} className="button field w-auto block my-4 mr-2">Save Changes</button>

                                <button onClick={handleCancelEdit} className="button field ~warning !low w-auto block my-4 mr-2">Cancel Edit</button>      

                                <button onClick={()=>{window.location.reload()}} disabled={!newUploads} className="button field w-auto block my-4 mr-2">Save Attachment</button>                          
                            </div>
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
                            
                            console.log(event.filenames.push(uuid));
                            console.log(uuid);
                            let str="";
                            console.log(event.filenames);
                            event.filenames.map(filename =>{str=str+'"';str=str+filename;str=str+'"';str=str+','});
                            let newstr=  str.substring(0,str.length-1);
                            console.log(event.filenames.pop());
                                    let query = `
                                    mutation{
                                        updateEvent(
                                            input: {
                                                id: "${event.id}",
                                                filenames : [ ${newstr} ]  
                                            }
                                                )
                                        { id }
                                    }`
                                    
                                    API.graphql(graphqlOperation(query)).then(res => {
                                        console.log(res);
                                    }).catch(e => console.log(e));
                            console.log(event.filenames.toString());
                            setNewUploads(true);

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
                        </>
                    ) : Parser(markdownConverter.makeHtml(event.note))}
                    {isEdit ?(
                        <>
                    <div className="flex items-center">
                        {event.filenames.map(filename => (<>
                            <button className="button ~critical !low" onClick={()=>deleteAttachment(filename)}>x</button>
                            <EventImage className="w-32 p-2 hover:bg-gray-200 content-center flex" s3key={filename} key={filename}></EventImage>
                        </>
                        ))}
                    </div>
                    </>
                    ):console.log()
                    }
                </div>

                
                {/* <button className="ml-auto button self-start absolute right-0 top-8 md:static" id={event.id + "-showMoreButton"} ref={showMoreButton} onClick={() => setShowOptions(!showOptions)}><FontAwesomeIcon icon={faEllipsisV}></FontAwesomeIcon></button>
                {showOptions && (
                    <div className="flex absolute flex-col bg-white right-0 rounded top-8 mt-8 py-2 border z-10">
                        <button className="hover:bg-gray-100 py-2 px-4 text-left" onClick={handleDeleteEvent}>Delete</button>
                        {!isEdit && <button className="hover:bg-gray-100 py-2 px-4 text-left" onClick={handleToggleEdit}>Edit</button>}
                        <button className="hover:bg-gray-100 py-2 px-4 text-left" onClick={handleToggleHidden}>
                            {isPrivate ? "Make public" : "Make private"}
                        </button>
                    </div>
                )} */}

                <MoreButton className="right-0" uid={event.id}>
                    <button className="hover:bg-gray-100 py-2 px-4 text-left" onClick={handleDeleteEvent}>Delete</button>
                    {!isEdit && <button className="hover:bg-gray-100 py-2 px-4 text-left" onClick={handleToggleEdit}>Edit</button>}
                    <button className="hover:bg-gray-100 py-2 px-4 text-left" onClick={handleToggleHidden}>
                        {isPrivate ? "Make public" : "Make private"}
                    </button>                    
                </MoreButton>
            </div>
        </div>
    )
}