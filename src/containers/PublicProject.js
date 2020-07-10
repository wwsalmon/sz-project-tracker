import React, {useState, useEffect} from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { API } from "aws-amplify";
import { format } from 'date-fns';

import PublicItem from "../components/PublicItem";
import Parser from "html-react-parser";
import * as Showdown from "showdown";
import utf8 from "utf8";
import {Helmet} from "react-helmet";
import getTitle from "../lib/getTitle";
import EventImage from "../components/EventImage";

export default function PublicProject() {
    let { id, postid } = useParams();
    if (postid === undefined) postid = false;
    const history = useHistory();
    const [projName, setProjName] = useState("");
    const [projDescript, setProjDescript] = useState("");
    const [identityId, setIdentityId] = useState("");
    const [events, setEvents] = useState([]);
    const [owner, setOwner] = useState("");
    const [featuredEvent, setFeaturedEvent] = useState(false);
    const [sortNew, setSortNew] = useState(false);
    // const [isLoading, setIsLoading] = useState(true);
    const [isInit, setIsInit] = useState(false);

    useEffect(() => {
        setIsInit(false);

        let projectData;

        function loadPublicProject() {
            const query = `
                query GetPublicProject($id: ID!){
                    getPublicProject(id: $id) {
                        id
                        name
                        description
                        ownerIdentityId
                        owner
                        publicEvents{
                            items{
                                id
                                note
                                filenames
                                time
                            }
                        }
                    }
                }
            `;
            return API.graphql({
                query: query,
                variables: {id: id},
                authMode: "API_KEY"}
                );
        }

        function loadPublicEvent(){
            const query = `
                query GetPublicEvent($id: ID!){
                    getPublicEvent(id: $id){
                        note
                        filenames
                        time
                    }
                }
            `;
            return API.graphql({
                query: query,
                variables: {id: postid},
                authMode: "API_KEY"
            });
        }

        async function onLoad() {
            try {
                projectData = await loadPublicProject();
                const projectItem = projectData.data.getPublicProject;
                if (projectItem == null){setProjName("error")} else{
                    setProjName(projectData.data.getPublicProject.name);
                    setProjDescript(projectData.data.getPublicProject.description);
                    setOwner(projectData.data.getPublicProject.owner);
                    setIdentityId(projectData.data.getPublicProject.ownerIdentityId);

                    const sortedEvents = projectData.data.getPublicProject.publicEvents.items.sort((a, b) => {
                        return new Date(b.time) - new Date(a.time);
                    });
                    setEvents(sortedEvents);
                }
            } catch (e) {
                console.error(e);
            }

            if (postid){
                try {
                    const featuredEventData = await loadPublicEvent();
                    const featuredEventItem = featuredEventData.data.getPublicEvent;
                    if (featuredEventItem === null){setFeaturedEvent("error")}
                    else {setFeaturedEvent(featuredEventData.data.getPublicEvent);}
                } catch (e) {
                    console.error(e);
                    setFeaturedEvent("error");
                }
            }

            setIsInit(true);

        }

        onLoad();
    }, [id, history, postid]);

    const markdownConverter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true
    });

    return (
        <div className="relative">
            <Helmet>
                <title>{getTitle(projName + " by " + owner)}</title>
                <meta
                    name="description"
                    content={`Project log for "${projName}" by ${owner}. ${projDescript ? `"${projDescript.substr(0,100)}..."` : ""} Created in SZ Project Tracker`}
                />
            </Helmet>
            {/* {isLoading && (
                <p className="aside ~info">Loading...</p>
            )} */}
            {isInit && (
                <>
                    {(postid && featuredEvent) ? (featuredEvent === "error" ? (
                        <>
                            <p>Error: invalid post ID</p>
                            <hr className="sep"/>
                            <hr className="my-4"/>
                            <p className="aside mb-12 ~neutral !normal content">This update is part of the project <b>{projName}</b>.
                            The latest updates in this project are shown below. <Link to={`/public/${id}`}>Go to project page</Link>
                            </p>
                        </>
                    ) : (
                        <div className="max-w-4xl mx-auto">
                            <p className="label">
                                <Link to={`/public/${id}`}>&lt; Back to project</Link>
                            </p>
                            <h1 className="heading my-4">{format(new Date(featuredEvent.time), "EEEE, MMMM d @ h:mm a")}</h1>
                            <p className="my-4">by <b>{owner}</b></p>
                            <div className="content mr-6 pt-4 md:mr-0 flex-1">
                                {Parser(markdownConverter.makeHtml(utf8.decode(featuredEvent.note)))}
                                <div className="overflow-x-auto mt-8 pt-8">
                                    <div className="flex pb-4">
                                        {featuredEvent.filenames.map(filename => (
                                            <div key={filename}>
                                                <EventImage s3key={filename} key={filename} public={true} identityId={identityId}/>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <hr className="sep"/>
                            <hr className="my-4"/>
                            <p className="aside mb-12 ~neutral !normal content">This update is part of the project <b>{projName}</b>.
                                The latest updates in this project are shown below. <Link to={`/public/${id}`}>Go to project page</Link>
                            </p>
                        </div>
                    )) : (
                        <>
                            <div className="text-center">
                                <p className="badge ~neutral !normal mb-8">Public project</p>
                                <h1 className="heading text-center">
                                    {projName === "error" ? "Error: invalid project ID" : projName}
                                </h1>
                                { projName !== "error" && <p className="my-4 text-center">by <b>{owner}</b></p>}
                                {projDescript !== null && (
                                <div className="max-w-2xl my-4 mx-auto content">{Parser(markdownConverter.makeHtml(projDescript))}</div>
                                )}
                            </div>
                            <hr className="sep"/>
                        </>
                    )}
                    {projName !== "error" && (
                        <>
                            <div className="flex justify-end items-center my-4">
                                <p className="mr-4 opacity-50">{sortNew ? "Sorting by newest first" : "Sorting by oldest first"}</p>
                                <button className="button block ~neutral"
                                        onClick={() => setSortNew(!sortNew)}>
                                    Toggle sorting
                                </button>
                            </div>
                            {(sortNew ? events : events.slice(0).reverse()).map((event, i, arr) =>
                            (
                                <div key={event.id}>
                                    {
                                        (i === 0 || format(new Date(arr[i - 1].time), "yyyy-MM-dd") !== format(new Date(event.time), "yyyy-MM-dd")) && (
                                            <p className="label my-4">{format(new Date(event.time), "EEEE, MMMM d")}</p>
                                        )
                                    }
                                    <hr/>
                                    <PublicItem event={event} publicProjectId={id} identityId={identityId}/>
                                </div>
                            ))}
                        </>
                    )}
                </>
            )}
        </div>
    )
}