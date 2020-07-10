import React, {useState, useEffect} from 'react';
import {Link, useHistory } from 'react-router-dom';
import {API, graphqlOperation} from 'aws-amplify';
import MoreButton from "../components/MoreButton";
import {useAuth} from "../lib/authLib";
import Modal from "../components/Modal";
import { format } from 'date-fns';
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Helmet} from "react-helmet";
import getTitle from "../lib/getTitle";
import {deleteProject} from "../lib/reqLib";

export default function Projects(props) {
    const history = useHistory();
    const auth = useAuth();

    // const [isLoading, setIsLoading] = useState(true);
    const [isInit, setIsInit] = useState(false);
    const [projects, setProjects] = useState([]);

    async function deleteProjectHelper(projectID) {
        const query = `
        query {
            getProject(id: "${projectID}") {
                id
                public
                events{
                    items{
                        id
                        hidden
                        filenames
                        publicEvent{
                            id
                        }
                    }
                }
                publicProject{
                    id        
                }
            }
        }`;
        const projectData = await API.graphql(graphqlOperation(query));
        const publicProject = projectData.data.getProject.publicProject;
        const publicId = publicProject ? publicProject.id : false;
        const projectEvents = projectData.data.getProject.events.items;

        deleteProject(projectID, publicId, projectEvents, () => {
            setProjects(projects.filter(p => p.id !== projectID));
        })
    }


    useEffect(() => {
        const listQuery = `
        query {
            listProjects{
                items{
                    id
                    name
                    public
                    createdAt
                    publicProject{
                        id
                    }
                    events{
                        items{
                            time
                        }
                    }     
                }
            }
        }
        `;

        function loadProjects() {
            return API.graphql(graphqlOperation(listQuery));
        }


        async function onLoad() {
            if (auth.authState !== "signedIn"){
                history.push({pathname: "/login", state: {message: "You must be logged in to access projects."}});
                return;
            }
            const projectsData = await loadProjects();
            let processedProjects = projectsData.data.listProjects.items;
            for (const i in processedProjects){
                const lastEventDate = processedProjects[i].events.items.map(x => new Date(x.time))
                    .sort((a, b) => b - a)[0] || new Date(processedProjects[i].createdAt);
                processedProjects[i]["lastEventDate"] = lastEventDate;
            }
            setProjects(processedProjects.sort((a, b) => b.lastEventDate - a.lastEventDate));
            // setIsLoading(false);
            setIsInit(true);
        }

        onLoad();
    }, [history, auth.authState]);

    return (

        <div>
            <Helmet>
                <title>{getTitle("Projects")}</title>
            </Helmet>
            {/* {isLoading && (
                <p className="aside ~info">Loading...</p>
            )} */}
            {(props.location !== undefined) && (props.location.state !== undefined) && props.location.state.justLoggedIn && (
                <p className="aside ~info my-4">Logged in!</p>
            )}
            {(props.location !== undefined) && (props.location.state !== undefined) && props.location.state.projectDeleted && (
                <p className="aside ~info my-4">Project deleted.</p>
            )}
            <div className="flex my-8 justify-between items-center">
                <h1 className="heading">Your projects</h1>
                <Link to="/newproject">
                    <button className="button ~info !high">
                        <FontAwesomeIcon icon={faPlus} className="pr-1"/> New Project
                    </button>
                </Link>
            </div>
            <hr className="my-8"></hr>
            {isInit && (
                <>
                    <div className="project-container grid md:grid-cols-2 gap-2 lg:grid-cols-3 my-4">
                        {projects.length > 0 ? projects.map((project) => (
                            <div key={project.id} className="card border relative overflow-visible">
                                <Link to={`/projects/${project.id}`}><p className="label">{project.name}</p></Link>
                                <div className="opacity-50 content">
                                    <p>Last update on {format(project.lastEventDate, "EEEE, MMMM d")}</p>
                                    <p>
                                        {project.public ? (
                                            <Link to={`/public/${project.publicProject.id}`} target="_blank">Public link</Link>
                                        ) : <span className="chip ~neutral !normal">Private project</span>}
                                    </p>
                                </div>
                                <MoreButton className="top-4 right-4">
                                    <Modal
                                        buttonClassName="button ~critical !low"
                                        buttonText="Delete Project"
                                    >
                                        <p className="my-4">
                                            Are you sure you want to delete project <b>{project.name}</b>?
                                        </p>
                                        <button
                                            className="button ~critical !high"
                                            onClick={() => deleteProjectHelper(project.id)}>Delete
                                        </button>
                                    </Modal>
                                </MoreButton>
                            </div>
                        )) : (
                            <p className="content">You don't have any projects yet. <Link to="/newproject">Create one now!</Link></p>
                        )}
                    </div>
                </>
            )}
        </div>
    )

}
