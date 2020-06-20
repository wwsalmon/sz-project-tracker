import React, {useState, useEffect} from "react";
import { useParams, useHistory } from "react-router-dom";
import { API } from "aws-amplify";
import { format } from 'date-fns';

import PublicItem from "../components/ProjectItem";

export default function PublicProject() {
    const { id } = useParams();
    const history = useHistory();
    const [projName, setProjName] = useState("");
    const [events, setEvents] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);
    const [isInit, setIsInit] = useState(false);

    useEffect(() => {
        let projectData;

        function loadPublicProject() {
            const query = `
                query GetPublicProject($id: ID!){
                    getPublicProject(id: $id) {
                        id
                        name
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

        async function onLoad() {
            try {
                projectData = await loadPublicProject();
                setProjName(projectData.data.getPublicProject.name);
                const sortedEvents = projectData.data.getPublicProject.publicEvents.items.sort((a, b) => {
                    return new Date(b.time) - new Date(a.time);
                });
                setEvents(sortedEvents);
                // setIsLoading(false);
                setIsInit(true);
            }
            catch (e) {
                console.log(e);
            }
        }

        onLoad();
    }, [id, history]);

    return (
        <div className="relative">
            {/* {isLoading && (
                <p className="aside ~info">Loading...</p>
            )} */}
            {isInit && (
                <>
                    <h1 className="heading">{projName}</h1>
                    <hr className="sep"/>
                    {events.map((event, i, arr) =>
                        (
                            <div key={event.id}>
                                {
                                    (i === 0 || format(new Date(arr[i - 1].time), "yyyy-MM-dd") !== format(new Date(event.time), "yyyy-MM-dd")) && (
                                        <p className="label my-4">{format(new Date(event.time), "EEEE, MMMM d")}</p>
                                    )
                                }
                                <PublicItem event={event}/>
                            </div>
                        ))}
                </>
            )}
        </div>
    )
}