import React, { Component } from 'react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { withRouter, Link } from 'react-router-dom';

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
                    name: "${this.state.projectName}"
                }){
                    id name createdAt updatedAt
                }
            }
            `
        try{
            await API.graphql(graphqlOperation(query));
            this.history.push("/projects")
        }
        catch(error){
            console.log(e);
        }
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