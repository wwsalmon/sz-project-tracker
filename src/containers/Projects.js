import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { API, graphqlOperation, Auth } from 'aws-amplify';

export default function Projects() {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const [isInit, setIsInit] = useState(false);
    const [projects, setProjects] = useState([]);

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

    async function signOut() {
        try {
            await Auth.signOut();
            history.push("/login")
        }
        catch (error) {
            console.log('error signing out: ', error);
        }
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
            console.log(e);
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
            {isInit && (
                <>
                    <Link to="/projects/new"><button className="button !normal ~neutral my-4">New Project</button></Link>
                    <button className="button !normal ~neutral my-4" onClick={() => signOut()}>Log out</button>
                    <div className="project-container grid md:grid-cols-2 gap-2 lg:grid-cols-3">
                        {projects.data.listProjects.items.map((project) => (
                            <div key={project.id} className="card border">
                                <Link to={`/projects/${project.id}`}><p>{project.name}</p></Link>
                                <button className="button" onClick={(e) => deleteProject(e, project.id)}>Delete</button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}


// render() {
//     const { authState } = this.state;
//     return (
//         <div className="max-w-6xl mx-auto px-2">
//             {authState === "loading" && (<p className="aside ~info my-4">Loading...</p>)}
//             {authState === "signIn" && (
//                 <>
//                     <button className="button !normal ~neutral my-4" onClick={() => {
//                         Auth.federatedSignIn({ provider: 'Google' });
//                     }}>Sign in with Google</button>
//                     <h3>Or, login with username</h3>
//                     <form onSubmit={this.handleLoginSubmit}>
//                         <p className="label">Username:</p>
//                         <input type="text" className="field ~neutral !normal w-auto my-1" value={this.state.username} onChange={this.handleFieldUsername}></input>
//                         <p className="label">Password:</p>
//                         <input type="password" className="field ~neutral !normal w-auto my-1" value={this.state.password} onChange={this.handleFieldPassword}></input>
//                         <input type="submit" className="button field w-auto block my-4"></input>
//                     </form>
//                 </>
//             )}
//             {authState === "signedIn" && (
//                 <>
//                     <p className="aside ~info my-4">Logged in!</p>
//                     <button className="button !normal ~neutral my-4" onClick={() => this.signOut()}>Log out</button>
//                     {this.state.projState === "loading" && (
//                         <p>Loading projects...</p>
//                     )}
//                     {this.state.projState === "ready" && (
//                         <>
//                             <button className="button !normal ~neutral my-4" onClick={() => this.signOut()}>New Project</button>
//                             <div class="project-container grid md:grid-cols-2 gap-2 lg:grid-cols-3">
//                                 {this.state.projects.map((project) => (
//                                     <div key={project.id} className="card border">
//                                         <p>{project.name}</p>
//                                         <button className="button">Delete</button>
//                                     </div>
//                                 ))}
//                             </div>
//                         </>

//                     )
//                     }
//                 </>
//             )}
//         </div>
//     )
// };