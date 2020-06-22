import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { API, graphqlOperation, Auth } from 'aws-amplify';



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
        }
        catch (error) {
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
            }
            catch (e) {
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
                    <Link to="/projects/new"><button className="button !normal ~neutral my-4">New Project</button></Link>
                    <p className="label my-4">Active Projects</p>
                    <div className="project-container grid md:grid-cols-2 gap-2 lg:grid-cols-3 my-4">
                        {projects.map((project) => (
                            <div key={project.id} className="card border">
                                <Link to={`/projects/${project.id}`}><p>{project.name}</p></Link>
                                
                                
                            
      <button
        className="bg-red-600 text-white active:bg-pink-600 font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
        type="button"
        style={{ transition: "all .15s ease" }}
        onClick={() => setShowModal(true)}
      >
        Delete Project
      </button>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            onClick={() => setShowModal(false)}
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Deleting a Project
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-gray-600 text-lg leading-relaxed">
                    Do you want to delete this project?
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                 
                  <br></br>
             <button className="bg-red-600 text-white active:bg-pink-600 font-bold uppercase text-sm px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1" onClick={(e) => deleteProject(e, project.id)}>Delete</button> 

                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
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
