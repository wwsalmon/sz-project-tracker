import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { API, graphqlOperation, Auth } from 'aws-amplify';

export default function Projects() {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const [projects, setProjects] = useState([]);

    const query = `
    query {
        listProjects{
        items{
            id
            name      
        }
        }
    }
    `

    useEffect(() => {
        function loadProjects() {
            return API.graphql(graphqlOperation(query));
        }

        async function onLoad() {
            try{
                console.log("checking authentication");
                await Auth.currentAuthenticatedUser();
                console.log("authenticated");
            }
            catch (e){
                console.log(e);
                history.push("/");
            }
            const projects = await loadProjects();
            setProjects(projects);
            setIsLoading(false);
        }

        onLoad();
    }, []);

    return (
        <div>
            {isLoading && (
                <p className="aside">Loading...</p>
            )}
            {!isLoading && (
                <>
                    <button className="button !normal ~neutral my-4">New Project</button>
                    <div className="project-container grid md:grid-cols-2 gap-2 lg:grid-cols-3">
                        {projects.data.listProjects.items.map((project) => (
                            <div key={project.id} className="card border">
                                <Link to={`/projects/${project.id}`}><p>{project.name}</p></Link>
                                <button className="button">Delete</button>
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