import React from "react";
import { format } from 'date-fns';
import { Link } from "react-router-dom";

import * as Showdown from "showdown";
import Parser from 'html-react-parser';
import utf8 from "utf8";

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
                <div className="content mr-6 md:mr-0 flex-1">
                    {Parser(markdownConverter.makeHtml(utf8.decode(event.note)))}
                </div>
            </div>
        </div>
    )
}