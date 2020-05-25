import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import {API, graphqlOperation, Auth} from 'aws-amplify';

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
  
  state = { projects: [], username: "sztest", password: "Passw0rd!", code: "" };

  async signUp() {
    const {username, password, email} = this.state;
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

  async SignIn() {
    console.log(this.state);
    const { username, password } = this.state;
  try {
    const user = await Auth.signIn(username, password);
    console.log(user);
  } catch (error) {
    console.log('error signing in', error);
  }
}

  async resendConfirmationCode() {
    const { username} = this.state;
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

  async componentDidMount(){
    await this.SignIn();
    const data = await API.graphql(graphqlOperation(query));
    this.setState({
      projects: data.data.listProjects.items
    })
  }
  render() {
    return (
      <>
      <div className="sz-navbar bg-black text-white px-4">
        <div className="sz-navbar-inner max-w-6xl sz-navbar-left">
          <div className="demo-navbar-logo"><span>Project Logger</span></div>
          <input type="checkbox" id="sz-navbar-check"></input>
          <label for="sz-navbar-check" className="sz-navbar-hamburger left-4">☰</label>
          <div className="sz-navbar-items ml-auto items-start px-4 sm:px-0 sm:items-center">
            <div className="sz-navbar-item"><span><Link to="/link1">Item 1</Link></span></div>
            <div className="sz-navbar-item"><span><Link to="/link2">Item 2</Link></span></div>
            <div className="sz-navbar-item"><span><Link to="/link3">Item 3</Link></span></div>
          </div>
        </div>
      </div>
      {
        this.state.projects.map((project, index) => (
          <p key={index}>{project.name}</p>
        ))
      }
      </>
    )
  };
}