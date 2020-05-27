import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { toDate, format } from 'date-fns';

import * as Showdown from "showdown";
import Parser from 'html-react-parser';

import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "./Project.css";

export default function Notes() {
    const { id } = useParams();
    const history = useHistory();
    const [projName, setProjName] = useState(null);
    const [newNote, setNewNote] = useState("Write a new update here...");
    const [mdeTab, setMdeTab] = useState("write");
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInit, setIsInit] = useState(false);
    let currDate = "initial"; // for loop later on

    function loadProject() {
        const query = `
        query {
            getProject(id: "${id}") {
                id
                name
            }
        }
    `
        return API.graphql(graphqlOperation(query));
    }

    function loadEvents(){
        const query = `
query {
  listEvents(filter: {projectID : {eq: "${id}"}}){
    items{
      id
      note
      time
      projectID
    }
  }
}
        `
        return API.graphql(graphqlOperation(query));
    }

    async function onLoad() {
        try {
            console.log("checking authentication");
            await Auth.currentAuthenticatedUser();
            console.log("authenticated");
        }
        catch (e) {
            console.log(e);
            history.push("/");
        }

        try {
            const project = await loadProject();
            setProjName(project.data.getProject.name);
            const events = await loadEvents();
            const sortedEvents = events.data.listEvents.items.sort((a,b)=>{
                return new Date(b.time) - new Date(a.time);
            });
            setEvents(sortedEvents);
            setIsLoading(false);
            setIsInit(true);
        }
        catch (e) {
            console.log(e);
        }
    }

    async function handleCreateEvent(e){
        e.preventDefault();
        console.log(newNote);
        let currentDate = new Date();
        const newNoteQuery = `
mutation {
  createEvent(input: {projectID: "${id}", time: "${currentDate.toISOString()}", note: """${newNote}"""}) {
    id
    note
    time
    projectID
  }
}
        `
        try {
            const newEvent = await API.graphql(graphqlOperation(newNoteQuery));
            setEvents([newEvent.data.createEvent, ...events]);
            setNewNote("");
        }
        catch (error) {
            console.warn(e);
        }
    }

    async function handleDeleteEvent(e, eventID) {
        e.preventDefault();
        const query = `
        mutation{
            deleteEvent(input: {id: "${eventID}"}){ note id }
        }
        `        
        try {
            await API.graphql(graphqlOperation(query));
            setEvents(events.filter(event => event.id != eventID));
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        onLoad();
    }, [id]);

    const markdownConverter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true
    });

    return (
        <div>
            {/* {isLoading && (
                <p className="aside ~info">Loading...</p>
            )} */}
            {isInit && (
                <>
                    <Link to="/projects"><button className="button ~neutral !normal my-4">Back to all projects</button></Link>
                    <h1 className="heading">{projName}</h1>
                    <hr className="sep"></hr>
                    <form onSubmit={handleCreateEvent}>
                        <p className="label my-4">Create New Update</p>
                        <SimpleMDE
                            value={newNote}
                            onChange={setNewNote}
                            options={{
                                spellChecker: false
                            }}
                        />
                        <input type="submit" value="Create Update" className="button field w-auto block my-4"></input>
                    </form>
                    <hr className="sep"></hr>
                    {events.map((event, i, arr) => (
                        <div key={event.id}>
                            { 
                                (i == 0 || format(new Date(arr[i - 1].time), "yyyy-MM-dd") != format(new Date(event.time), "yyyy-MM-dd")) && (
                                    <p className="label my-4">{format(new Date(event.time), "EEEE, MMMM d")}</p>
                                )
                            }
                            <hr></hr>
                            <div className="md:flex py-8 hover:bg-gray-100 rounded">
                                <p className="w-32 supra flex-none">{
                                format(new Date(event.time), "h:mm a")
                                }</p>
                                <div className="content">
                                    {Parser(markdownConverter.makeHtml(event.note))}
                                    <button className="button" onClick={(e) => handleDeleteEvent(e, event.id)}>Delete</button>
                                </div>
                            </div>

                        </div>
                    ))}
                </>
            )}
        </div>
    )
}