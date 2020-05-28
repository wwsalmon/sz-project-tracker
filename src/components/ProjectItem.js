
import React, {useState} from "react";
import { API, graphqlOperation, Storage } from "aws-amplify";
import { format } from 'date-fns';

import * as Showdown from "showdown";
import Parser from 'html-react-parser';

import EventImage from "../components/EventImage";

import { SRLWrapper } from "simple-react-lightbox";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

export default function ProjectItem(props) {
    const [showOptions, setShowOptions] = useState(false);
    const removeLocal = props.removeLocal;

    async function handleDeleteEvent(e, eventID, filenames) {
        e.preventDefault();
        const query = `
        mutation{
            deleteEvent(input: {id: "${eventID}"}){ note id }
        }
        `
        try {
            await API.graphql(graphqlOperation(query));
            removeLocal(eventID);
        }
        catch (error) {
            console.log(error);
        }

        for (const filename of filenames) {
            try {
                await Storage.vault.remove(filename);
            }
            catch (e) {
                console.log(e);
            }
        }
    }

    const markdownConverter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true
    });

    const event = props.event;

    return (
        <div className="md:flex py-8 hover:bg-gray-100 rounded relative">
            <p className="w-32 supra flex-none">{
                format(new Date(event.time), "h:mm a")
            }</p>
            <div className="content">
                {Parser(markdownConverter.makeHtml(event.note))}
                <SRLWrapper>
                    <div className="flex items-center">
                        {event.filenames.map(filename => (
                            <EventImage className="w-32 p-2 hover:bg-gray-200 content-center flex" s3key={filename} key={filename}></EventImage>
                        ))}
                    </div>
                </SRLWrapper>
            </div>
            <button className="ml-auto button self-start" onClick={() => setShowOptions(!showOptions)}><FontAwesomeIcon icon={faEllipsisV}></FontAwesomeIcon></button>
            {showOptions && (
                <div className="flex absolute flex-col bg-white right-0 rounded top-8 mt-8 py-2 border">
                    <button className="hover:bg-gray-100 py-2 px-4 text-left" onClick={(e) => handleDeleteEvent(e, event.id, event.filenames)}>Delete</button>
                    <button className="hover:bg-gray-100 py-2 px-4 text-left">Edit</button>
                    <button className="hover:bg-gray-100 py-2 px-4 text-left">Hide</button>
                </div>
            )}
        </div>
    )
}