import React, {useState, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {API, graphqlOperation, Auth} from 'aws-amplify';
import MoreButton from "../components/MoreButton";


export default function Projects(props) {
    const history = useHistory();
    const [showModal, setShowModal] = useState(false);

    // const [isLoading, setIsLoading] = useState(true);
    const [isInit, setIsInit] = useState(false);
    const [projects, setProjects] = useState([]);

    console.log(props.location);

    async function deleteProject(e, projectID) {
        e.preventDefault();
        // setIsLoading(true);
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
            setProjects(projects.filter(p => p.id !== projectID));
        } catch (error) {
            // setIsLoading(false);
            console.log(error);
        }

    }


    useEffect(() => {
        console.log("running projects useeffect");
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
            } catch (e) {
                console.log(e);
                history.push("/login");
            }
            const projectsData = await loadProjects();
            setProjects(projectsData.data.listProjects.items);
            // setIsLoading(false);
            setIsInit(true);
        }

        onLoad();
    }, [history]);

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
                    <Link to="/projects/new">
                        <button className="button !normal ~neutral my-4">New Project</button>
                    </Link>
                    <p className="label my-4">Active Projects</p>
                    <div className="project-container grid md:grid-cols-2 gap-2 lg:grid-cols-3 my-4">
                        {projects.map((project) => (
                            <div key={project.id} className="card border relative overflow-visible">
                                <Link to={`/projects/${project.id}`}><p>{project.name}</p></Link>
                                <MoreButton className="absolute top-4 right-4">
                                    <button
                                        className="button ~critical !low"
                                        type="button"
                                        style={{transition: "all .15s ease"}}
                                        onClick={() => setShowModal(true)}
                                    >
                                        Delete Project
                                    </button>
                                </MoreButton>



                                {showModal ? (
                                    <>
                                        <div className="flex items-center justify-center fixed inset-0 z-50" onClick={() => setShowModal(false)}>
                                            <div className="relative card bg-white">
                                                <button className="" onClick={() => setShowModal(false)}>
                                                    <span className="opacity-5 outline-none focus:outline-none">×</span>
                                                </button>
                                                <p className="my-4">
                                                    Are you sure you want to delete project <b>{project.name}</b>?
                                                </p>
                                                <button
                                                    className="button ~critical !high"
                                                    onClick={(e) => deleteProject(e, project.id)}>Delete
                                                </button>
                                            </div>
                                        </div>
                                        <div className="opacity-25 fixed inset-0 z-40 bg-black"/>
                                    </>
                                ) : null}

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
