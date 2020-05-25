import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import { Link } from 'react-router-dom';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            authState: "loading",
            username: "wwsalmon",
            password: "Passw0rd!",
            code: ""
        };
        this.handleFieldUsername = this.handleFieldUsername.bind(this);
        this.handleFieldPassword = this.handleFieldPassword.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        this.handleFieldCode = this.handleFieldCode.bind(this);
        this.handleConfirmSubmit = this.handleConfirmSubmit.bind(this);
    }

    componentDidMount() {
        Auth.currentAuthenticatedUser().then(() => {
            this.setState({ isLoading: false, authState: "signedIn" });
        }).catch(e => {
            console.log(e);
            this.setState({ isLoading: false, authState: "signIn" })
        })
    }

    handleFieldUsername(e) {
        this.setState({ username: e.target.value });
    }

    handleFieldPassword(e) {
        this.setState({ password: e.target.value });
    }

    handleFieldCode(e) {
        this.setState({ code: e.target.value });
    }

    async handleLoginSubmit(e) {
        e.preventDefault();
        this.signIn();
    }

    async handleConfirmSubmit(e) {
        e.preventDefault();
        this.confirmSignUp();
    }

    async confirmSignUp() {
        const { username, code } = this.state;
        this.setState({ isLoading: true });
        try {
            await Auth.confirmSignUp(username, code);
            this.setState({ isLoading: false, authState: "signedIn" });
        } catch (error) {
            this.setState({ isLoading: false });
            console.log('error confirming sign up', error);
        }
    }

    async signIn() {
        this.setState({ isLoading: true });
        const { username, password } = this.state;
        try {
            await Auth.signIn(username, password).then(() => {
                this.setState({ isLoading: false, authState: "signedIn" });
            });
        } catch (error) {
            if (error.code === "UserNotConfirmedException"){
                this.setState({isLoading: false, authState: "confirm"});
            }
            else {
                console.log('error signing in', error);
                this.setState({ isLoading: false, authState: "signIn" });
            }
        }
    }

    async signOut() {
        try {
            await Auth.signOut();
            this.setState({ authState: "signIn" });
        }
        catch (error) {
            console.log('error signing out: ', error);
        }
    }

    render() {
        const { authState, isLoading } = this.state;
        return (
            <>
                {isLoading && (<p className="aside ~info my-4">Loading...</p>)}
                {authState === "signIn" && (
                    <>
                        <button className="button !normal ~neutral my-4" onClick={() => {
                            Auth.federatedSignIn({ provider: 'Google' });
                        }}>Sign in with Google</button>
                        <Link to="/signup"><button className="button !high ~neutral my-4">Sign up</button></Link>
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
                        <button className="button !normal ~neutral my-4" onClick={this.signOut}>Log out</button>
                        <Link to="/projects"><button className="button !high ~neutral my-4">Go to projects</button></Link>
                    </>
                )}
                {authState === "confirm" && (
                    <>
                        <h3>Confirm your account</h3>
                        <form onSubmit={this.handleConfirmSubmit}>
                            <p className="label">Enter the code sent to your email.</p>
                            <input type="text" className="field ~neutral !normal w-auto my-1" value={this.state.code} onChange={this.handleFieldCode}></input>
                            <input type="submit" className="button field w-auto block my-4"></input>
                        </form>
                    </>
                )}
            </>
        )
    };
}