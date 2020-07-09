import React, {useState, useEffect} from "react";
import {API, graphqlOperation} from "aws-amplify";

export default function (props) {
    const [projectList, setProjectList] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");

    async function moveEvent(){
        if (props.event.public){
            alert("Cannot move public event. Make event private first, then move it.")
            return;
        }

        const fileUUIDs = `[${props.event.filenames.map(d => `"${d}"`)}]`;

        const moveEventReq = `
            mutation{
                createEvent(input: {
                    eventProjectId: "${selectedProject}",
                    time: "${props.event.time}",
                    filenames: ${fileUUIDs},
                    note: """${props.event.note}""",
                    hidden: true
                }){ id }
                deleteEvent(input: {id: "${props.event.id}"}){ id }
            }
        `;

        API.graphql(graphqlOperation(moveEventReq)).then(() => {
            props.modal.current.closeModal();
            props.removeLocal(props.event.id);
        }).catch(e => {
            console.log(e);
        })
    }

    useEffect(() => {
        const listQuery = `
        query {
            listProjects{
                items{
                    id
                    name
                }
            }
        }
        `;

        function loadProjects() {
            return API.graphql(graphqlOperation(listQuery));
        }

        async function onLoad() {
            const projectsData = await loadProjects();
            const allProjects = projectsData.data.listProjects.items.filter(d => d.id !== props.event.project.id);
            setSelectedProject(allProjects[0].id);
            setProjectList(allProjects);
        }

        onLoad();
    }, [props.event.project.id]);

    return (
        <div className="mt-4">
            <p className="label my-4">Select project to move event to:</p>
            <div className="select my-4">
                <select name="" id="" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
                    {projectList.map(project => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                </select>
            </div>
            <button className="button ~info !high mr-2"
                    onClick={moveEvent}>
                Move event
            </button>
            <button className="button ~critical !low mr-2"
                    onClick={props.modal.current.closeModal}>
                Cancel
            </button>
        </div>
    )
}