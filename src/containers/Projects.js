import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { API, graphqlOperation, Auth } from 'aws-amplify';

export default function Projects(props) {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const [isInit, setIsInit] = useState(false);
    const [projects, setProjects] = useState([]);

    console.log(props.location);

    const listQuery = `
    query {
        listProjects{
        items{
            id
            name      
        }
        }
    }
    `
    function loadProjects() {
        return API.graphql(graphqlOperation(listQuery));
    }

    async function onLoad() {
        try {
            console.log("checking authentication");
            await Auth.currentAuthenticatedUser();
            console.log("authenticated");
        }
        catch (e) {
            console.log(e);
            history.push("/login");
        }
        const projects = await loadProjects();
        setProjects(projects);
        setIsLoading(false);
        setIsInit(true);
    }

    async function deleteProject(e, projectID) {
        e.preventDefault();
        setIsLoading(true);
        const deleteQuery = `
            mutation {
                deleteProject(input: {
                    id: "${projectID}"
                }){
                    name id
                }
            }
        `
        try {
            await API.graphql(graphqlOperation(deleteQuery));
            const projects = await loadProjects();
            setIsLoading(false);
            setProjects(projects);
        }
        catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    }

    useEffect(() => {
        onLoad();
    }, []);

    return (
        <div>
            {/* {isLoading && (
                <p className="aside ~info">Loading...</p>
            )} */}
            {(props.location !== undefined) && (props.location.state !== undefined) && props.location.state.justLoggedIn && (
                <p className="aside ~info my-4">Logged in!</p>
            )}
            {(props.location !== undefined) && (props.location.state !== undefined) && props.location.state.projectDeleted && (
                <p className="aside ~info my-4">Project deleted.</p>
            )}
            {isInit && (
                <>
                    <Link to="/projects/new"><button className="button !normal ~neutral my-4">New Project</button></Link>
                    <p className="label my-4">Active Projects</p>
                    <div className="project-container grid md:grid-cols-2 gap-2 lg:grid-cols-3 my-4">
                        {projects.data.listProjects.items.map((project) => (
                            <div key={project.id} className="card border">
                                <Link to={`/projects/${project.id}`}><p>{project.name}</p></Link>
                                <button className="button" onClick={(e) => deleteProject(e, project.id)}>Delete</button>
                            </div>
                        ))}
                    </div>
                    <hr className="my-16"></hr>
                    <p className="label my-4">Archived</p>
                </>
            )}
        </div>
    )
}
