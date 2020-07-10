import React from "react";
import { format } from 'date-fns';
import { Link } from "react-router-dom";

import * as Showdown from "showdown";
import Parser from 'html-react-parser';
import utf8 from "utf8";
import EventImage from "./EventImage";

export default function PublicItem(props) {
    const event = props.event;
    const publicProjectId = props.publicProjectId;

    const markdownConverter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true
    });

    return (
        <div>
            <div className="md:flex py-8 hover:bg-gray-100 rounded relative">
                <div className="w-32 flex-none flex md:block mb-4 md:mb-0">
                    <Link to={`/public/${publicProjectId}/${event.id}`}>
                        <p className="supra">{
                            format(new Date(event.time), "h:mm a")
                        }</p>
                    </Link>
                </div>
                <div className="content mr-6 md:mr-0 md:w-8" style={{flex: "1 0 0"}}>
                    {Parser(markdownConverter.makeHtml(utf8.decode(event.note)))}
                    <div className="overflow-x-auto mt-8 pt-8">
                        <div className="flex pb-4">
                            {event.filenames.map(filename => (
                                <div key={filename}>
                                    <EventImage s3key={filename} public={true} identityId={props.identityId}/>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}