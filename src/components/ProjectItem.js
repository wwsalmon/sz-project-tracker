
import React, {useState} from "react";
import { API, graphqlOperation, Storage } from "aws-amplify";
import { format } from 'date-fns';

import * as Showdown from "showdown";
import Parser from 'html-react-parser';

import EventImage from "../components/EventImage";

import { SRLWrapper } from "simple-react-lightbox";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function ProjectItem(props) {
    const event = props.event;
    const [showOptions, setShowOptions] = useState(false);
    const [isHidden, setIsHidden] = useState(event.hidden);
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
        changeHiddenLocal(event.id, !isHidden);
        setIsHidden(!isHidden);
        const query = `
        mutation{
            updateEvent(input: {id: "${event.id}", hidden: ${!isHidden}}){ id }
        }
        `
        API.graphql(graphqlOperation(query)).then(res => console.log(res)).catch(e => console.log(e));
    }

    const markdownConverter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true
    });

    return (
        <div className={isHidden ? "projectItemHidden" : ""}>
            <hr></hr>
            <div className="md:flex py-8 hover:bg-gray-100 rounded relative">
                <div className="w-32 flex-none flex md:block mb-4 md:mb-0">
                    <p className="supra">{
                        format(new Date(event.time), "h:mm a")
                    }</p>
                    {isHidden && (<FontAwesomeIcon className="opacity-25 ml-2 md:ml-0 md:my-4" icon={faEyeSlash}></FontAwesomeIcon>)}
                </div>
                <div className="content mr-6 md:mr-0">
                    {Parser(markdownConverter.makeHtml(event.note))}
                    <SRLWrapper>
                        <div className="flex items-center">
                            {event.filenames.map(filename => (
                                <EventImage className="w-32 p-2 hover:bg-gray-200 content-center flex" s3key={filename} key={filename}></EventImage>
                            ))}
                        </div>
                    </SRLWrapper>
                </div>
                <button className="ml-auto button self-start absolute right-0 top-8 md:static" onClick={() => setShowOptions(!showOptions)}><FontAwesomeIcon icon={faEllipsisV}></FontAwesomeIcon></button>
                {showOptions && (
                    <div className="flex absolute flex-col bg-white right-0 rounded top-8 mt-8 py-2 border z-10">
                        <button className="hover:bg-gray-100 py-2 px-4 text-left" onClick={handleDeleteEvent}>Delete</button>
                        <button className="hover:bg-gray-100 py-2 px-4 text-left">Edit</button>
                        <button className="hover:bg-gray-100 py-2 px-4 text-left" onClick={handleToggleHidden}>
                            {isHidden ? "Show" : "Hide"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}