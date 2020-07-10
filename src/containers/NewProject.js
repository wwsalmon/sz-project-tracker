import React, {useState} from 'react';
import {useHistory} from "react-router-dom";
import {API, graphqlOperation} from 'aws-amplify';
import utf8 from "utf8";

import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import {Helmet} from "react-helmet";
import getTitle from "../lib/getTitle";

import {useAuth} from "../lib/authLib";

export default function NewProject() {
    const defaultName = "Enter a project name...";
    const [projName, setProjName] = useState(defaultName);
    const [projDescript, setProjDescript] = useState("");
    const [isPublic, setIsPublic] = useState(false);

    const history = useHistory();
    const auth = useAuth();

    async function handleCreate() {
        try {
            const encodedDescript = utf8.encode(projDescript);
            const createReq = `
            mutation create($name: String!, $descript: String){
                createProject(input: {
                    name: $name,
                    description: $descript,
                    archived: false,
                    sortNew: true
                }){
                    id
                }
            }
            `;
            const createData = await API.graphql(graphqlOperation(createReq, {
                descript: encodedDescript,
                name: projName
            }));
            const createId = createData.data.createProject.id;
            if (isPublic) {
                const identityId = await auth.getIdentityId();
                const publicReq = `
                mutation create($name: String!, $descript: String){
                    createPublicProject(input: {
                        name: $name,
                        description: $descript,
                        publicProjectProjectId: "${createId}",
                        ownerIdentityId: "${identityId}"
                    }){
                        id
                    }
                }                
                `
                const publicData = await API.graphql(graphqlOperation(publicReq, {
                    descript: encodedDescript,
                    name: projName
                }));
                const publicId = publicData.data.createPublicProject.id;

                const updateReq = `
                mutation{
                    updateProject(input: {
                        id: "${createId}",
                        public: true,
                        projectPublicProjectId: "${publicId}"
                    }){
                        id name publicProject{
                            id name
                        }
                    }
                }
                `;
                await API.graphql(graphqlOperation(updateReq));
            }
            history.push(`/projects/${createId}`);
        } catch (e) {
            console.log(e);
        }
    }

    function handleCancel(e) {
        e.preventDefault();
        if ((projName === defaultName && projDescript.length === 0) ||
            window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
            setProjName(defaultName);
            setProjDescript("");
            history.push("/projects");
        }
    }

    return (
        <>
            <Helmet>
                <title>{getTitle("New project")}</title>
            </Helmet>
            <div className="max-w-2xl mx-auto">
                <button className="label my-4" onClick={handleCancel}>&lt; Back to all projects</button>
                <h1 className="heading my-4">New project</h1>
                <hr className="my-8"/>
                <p className="label my-4">Project name:</p>
                <input className="subheading block w-full border p-2" type="text" value={projName} onChange={e => {
                    setProjName(e.target.value)
                }}/>
                <p className="label mt-8 mb-4">Project description (optional):</p>
                <SimpleMDE
                    value={projDescript}
                    onChange={setProjDescript}
                    options={{
                        spellChecker: false,
                    }}
                    className="mt-4"
                />
                <button className="button ~info !high mr-2"
                        onClick={handleCreate}>Create project
                </button>
                <button className="button ~critical !low mr-2" onClick={handleCancel}>Cancel</button>
                <label>
                    <input type="checkbox" checked={isPublic}
                           onChange={e => {
                               setIsPublic(e.target.checked)
                           }}
                    />
                    <span className="ml-2">Make this project public?</span>
                </label>
            </div>
        </>
    )
}