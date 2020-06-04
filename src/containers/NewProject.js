import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { withRouter } from 'react-router-dom';

class NewProject extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            projectName: ""
        }

        this.handleProjectName = this.handleProjectName.bind(this);
        this.handleProjectSubmit = this.handleProjectSubmit.bind(this);
        this.history = this.props.history;
    }

    handleProjectName(e) {
        this.setState({ projectName: e.target.value });
    }

    async handleProjectSubmit(e){
        e.preventDefault();
        const query = `
            mutation {
                createProject(input: {
                    name: "${this.state.projectName}",
                    archived: ${false}
                }){
                    id name createdAt updatedAt archived
                }
            }
            `
        API.graphql(graphqlOperation(query)).then(res => {
            this.history.push(`/projects/${res.data.createProject.id}`)
        }).catch(e => {
            console.log(e);
        });
    }

    render() {
        return (
            <>
                <form onSubmit={this.handleProjectSubmit}>
                    <p className="label">Project name:</p>
                    <input type="text" className="field ~neutral !normal w-auto my-1" value={this.state.projectName} onChange={this.handleProjectName}></input>
                    <input type="submit" value="Create Project" className="button field w-auto block my-4"></input>
                </form>
            </>
        )
    }
    
}

export default withRouter(NewProject);