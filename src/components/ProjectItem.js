
import React, {useState} from "react";
import { API, graphqlOperation, Storage } from "aws-amplify";
import { format } from 'date-fns';

import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "./ProjectNewEvent.css";

import * as Showdown from "showdown";
import Parser from 'html-react-parser';

import EventImage from "../components/EventImage";

import { SRLWrapper } from "simple-react-lightbox";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faGlobe } from "@fortawesome/free-solid-svg-icons";

export default function ProjectItem(props) {
    const event = props.event;
    const [showOptions, setShowOptions] = useState(false);
    const [isPrivate, setIsPrivate] = useState(event.hidden);
    const [isEdit, setIsEdit] = useState(false);
    const [newNote, setNewNote] = useState(event.note);
    const removeLocal = props.removeLocal;
    const changeHiddenLocal = props.changeHiddenLocal;

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

    async function handleToggleHidden(e){
        e.preventDefault();
        changeHiddenLocal(event.id, !isPrivate);
        setIsPrivate(!isPrivate);
        const query = `
        mutation{
            updateEvent(input: {id: "${event.id}", hidden: ${!isPrivate}}){ id }
        }
        `
        API.graphql(graphqlOperation(query)).then(res => console.log(res)).catch(e => console.log(e));
    }

    function handleToggleEdit(e){
        e.preventDefault();
        setIsEdit(true);
    }

    async function handleEditEvent(e){
        e.preventDefault();
        const query = `
        mutation{
            updateEvent(input: {id: "${event.id}", note: """${newNote}"""}){ id }
        }
        `
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
                                <button onClick={handleEditEvent} disabled={newNote == event.note} className="button field w-auto block my-4 mr-2">Save Changes</button>
                                <button onClick={handleCancelEdit} className="button field ~warning !low w-auto block my-4 mr-2">Cancel Edit</button>
                            </div>
                        </>
                    ) : Parser(markdownConverter.makeHtml(event.note))}
                    <div className="flex items-center">
                        {event.filenames.map(filename => (
                            <EventImage className="w-32 p-2 hover:bg-gray-200 content-center flex" s3key={filename} key={filename}></EventImage>
                        ))}
                    </div>
                </div>
                <button className="ml-auto button self-start absolute right-0 top-8 md:static" onClick={() => setShowOptions(!showOptions)}><FontAwesomeIcon icon={faEllipsisV}></FontAwesomeIcon></button>
                {showOptions && (
                    <div className="flex absolute flex-col bg-white right-0 rounded top-8 mt-8 py-2 border z-10">
                        <button className="hover:bg-gray-100 py-2 px-4 text-left" onClick={handleDeleteEvent}>Delete</button>
                        {!isEdit && <button className="hover:bg-gray-100 py-2 px-4 text-left" onClick={handleToggleEdit}>Edit</button>}
                        <button className="hover:bg-gray-100 py-2 px-4 text-left" onClick={handleToggleHidden}>
                            {isPrivate ? "Make public" : "Make private"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}