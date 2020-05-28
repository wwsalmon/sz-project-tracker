
import React from "react";
import { API, graphqlOperation, Storage } from "aws-amplify";
import { format } from 'date-fns';

import * as Showdown from "showdown";
import Parser from 'html-react-parser';

import EventImage from "../components/EventImage";

import { SRLWrapper } from "simple-react-lightbox";

export default function ProjectItem(props) {
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
        <div className="md:flex py-8 hover:bg-gray-100 rounded">
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
                <button className="button" onClick={(e) => handleDeleteEvent(e, event.id, event.filenames)}>Delete</button>
            </div>
        </div>
    )
}