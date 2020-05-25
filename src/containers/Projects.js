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