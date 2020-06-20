import React from "react";
import { format } from 'date-fns';

import * as Showdown from "showdown";
import Parser from 'html-react-parser';

export default function PublicItem(props) {
    const event = props.event;

    const markdownConverter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true
    });

    return (
        <div>
            <hr/>
            <div className="md:flex py-8 hover:bg-gray-100 rounded relative">
                <div className="w-32 flex-none flex md:block mb-4 md:mb-0">
                    <p className="supra">{
                        format(new Date(event.time), "h:mm a")
                    }</p>
                </div>
                <div className="content mr-6 md:mr-0 flex-1">
                    {Parser(markdownConverter.makeHtml(event.note))}
                </div>
            </div>
        </div>
    )
}