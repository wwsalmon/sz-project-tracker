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
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      authState: "loading",
      projState: "none",
      username: "sztest",
      password: "Passw0rd!",
      code: ""
    };
    this.handleFieldUsername = this.handleFieldUsername.bind(this);
    this.handleFieldPassword = this.handleFieldPassword.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser().then(() => {
      this.setState({ authState: "signedIn" });
      this.loadProjects();
    }).catch(e => {
      console.log(e);
      this.setState({ authState: "signIn" })
    })
  }

  handleFieldUsername(e) {
    this.setState({ username: e.target.value });
  }

  handleFieldPassword(e) {
    this.setState({ password: e.target.value });
  }

  async handleLoginSubmit(e) {
    e.preventDefault();
    this.signIn();
  }

  // async signUp() {
  //   const { username, password, email } = this.state;
  //   try {
  //     const user = await Auth.signUp({
  //       username, password,
  //       attributes: {
  //         email,
  //       }
  //     });
  //     console.log({ user })
  //   } catch (error) {
  //     console.log('error signing up: ', error);
  //   }
  // }

  // async confirmSignUp() {
  //   const { username, code } = this.state;
  //   try {
  //     await Auth.confirmSignUp(username, code);
  //   } catch (error) {
  //     console.log('error confirming sign up', error);
  //   }
  // }

  async signIn() {
    this.setState({ authState: "loading" });
    const { username, password } = this.state;
    try {
      await Auth.signIn(username, password).then(() => {
        this.setState({ authState: "signedIn" });
        this.loadProjects();
      });
    } catch (error) {
      console.log('error signing in', error);
      this.setState({ authState: "signIn" });
    }
  }

  // async resendConfirmationCode() {
  //   const { username } = this.state;
  //   try {
  //     await Auth.resendSignUp(username);
  //     console.log('code resent succesfully');
  //   } catch (err) {
  //     console.log('error resending code: ', err);
  //   }
  // }

  async signOut() {
    try {
      await Auth.signOut();
      this.setState({ authState: "signIn" });
    }
    catch (error) {
      console.log('error signing out: ', error);
    }
  }

  async loadProjects() {
    this.setState({
      projState: "loading"
    })
    const data = await API.graphql(graphqlOperation(query));
    this.setState({
      projects: data.data.listProjects.items,
      projState: "ready"
    })
  }

  render() {
    const { authState } = this.state;
    return (
      <div className="App m-4">
        {authState === "loading" && (<p>Loading...</p>)}
        {authState === "signIn" && (
          <>
            <button className="button !normal ~neutral my-4" onClick={() => {
              Auth.federatedSignIn({ provider: 'Google' });
            }}>Sign in with Google</button>
            <h3>Or, login with username</h3>
            <form onSubmit={this.handleLoginSubmit}>
              <p className="label">Username:</p>
              <input type="text" className="field ~neutral !normal w-auto my-1" value={this.state.username} onChange={this.handleFieldUsername}></input>
              <p className="label">Password:</p>
              <input type="password" className="field ~neutral !normal w-auto my-1" value={this.state.password} onChange={this.handleFieldPassword}></input>
              <input type="submit" className="button field w-auto block my-4"></input>
            </form>
          </>
        )}
        {authState === "signedIn" && (
          <>
            <p className="aside ~info my-4">Logged in!</p>
            <button className="button !normal ~neutral my-4" onClick={() => this.signOut()}>Log out</button>
            {this.state.projState === "loading" && (
              <p>Loading projects...</p>
            )}
            {this.state.projState === "ready" &&
              this.state.projects.map((project, index) => (
                <div key={index} className="card my-4">
                  <p>{project.name}</p>
                </div>
              ))
            }
          </>
        )}
      </div>
    )
  };
}