import React, { Component } from 'react';

import { API, graphqlOperation, Auth } from 'aws-amplify';

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

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      projects: [],
      user: false,
      username: "sztest",
      password: "Passw0rd!",
      code: ""
    };
    this.handleFieldUsername = this.handleFieldUsername.bind(this);
    this.handleFieldPassword = this.handleFieldPassword.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
  }

  handleFieldUsername(e){
    this.setState({username: e.target.value});
  }

  handleFieldPassword(e){
    this.setState({password: e.target.value});
  }

  async handleLoginSubmit(e){
    e.preventDefault();
    console.log(this.state.username, this.state.password);
    this.setState({user: await this.signIn()})
  }

  async signUp() {
    const { username, password, email } = this.state;
    try {
      const user = await Auth.signUp({
        username, password,
        attributes: {
          email,
        }
      });
      console.log({ user })
    } catch (error) {
      console.log('error signing up: ', error);
    }
  }

  async confirmSignUp() {
    const { username, code } = this.state;
    try {
      await Auth.confirmSignUp(username, code);
    } catch (error) {
      console.log('error confirming sign up', error);
    }
  }

  async signIn() {
    console.log(this.state);
    const { username, password } = this.state;
    try {
      const user = await Auth.signIn(username, password);
      return user;
    } catch (error) {
      console.log('error signing in', error);
      return false;
    }
  }

  async resendConfirmationCode() {
    const { username } = this.state;
    try {
      await Auth.resendSignUp(username);
      console.log('code resent succesfully');
    } catch (err) {
      console.log('error resending code: ', err);
    }
  }

  async signOut() {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  async loadProjects() {
    const data = await API.graphql(graphqlOperation(query));
    this.setState({
      projects: data.data.listProjects.items
    })
  }

  render() {
    if (this.state.user) {
      this.loadProjects();
      return (
        <>
          <h3>Logged in!</h3>
          {
            this.state.projects.map((project, index) => (
              <p key={index}>{project.name}</p>
            ))
          }
        </>
      )
    }
    else {
      return (
        <>
          <button className="button !normal ~neutral m-4">Sign in with Google</button>
          <h3>Or, login with username</h3>
          <form onSubmit={this.handleLoginSubmit}>
            <p className="label">Username:</p>
            <input type="text" className="field ~neutral !normal w-auto my-1" value={this.state.username} onChange={this.handleFieldUsername}></input>
            <p className="label">Password:</p>
            <input type="password" className="field ~neutral !normal w-auto my-1" value={this.state.password} onChange={this.handleFieldPassword}></input>
            <input type="submit" className="button field w-auto block my-4"></input>
          </form>
        </>
      )
    }
  };
}