import React, { Component } from "react";
import { Auth } from 'aws-amplify';
import { withRouter, Link } from 'react-router-dom';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            authState: "loading",
            username: "wwsalmon",
            email: "wwsamson12309@gmail.com",
            password: "Passw0rd!",
            code: ""
        };
        this.handleFieldEmail = this.handleFieldEmail.bind(this);
        this.handleFieldUsername = this.handleFieldUsername.bind(this);
        this.handleFieldPassword = this.handleFieldPassword.bind(this);
        this.handleFieldCode = this.handleFieldPassword.bind(this);
        this.handleSignUpSubmit = this.handleSignUpSubmit.bind(this);
        this.handleConfirmSubmit = this.handleConfirmSubmit.bind(this);
        this.history = this.props.history;
    }

    componentDidMount() {
        Auth.currentAuthenticatedUser().then(() => {
            this.setState({ authState: "signedIn" });
            this.history.push("/projects");
        }).catch(e => {
            console.log(e);
            this.setState({ isLoading: false, authState: "signUp" })
        })
    }

    handleFieldEmail(e) {
        this.setState({ email: e.target.value });
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

    async handleSignUpSubmit(e) {
        e.preventDefault();
        this.signUp();
    }

    async handleConfirmSubmit(e) {
        e.preventDefault();
        this.confirmSignUp();
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

    async signUp() {
        const { username, password, email } = this.state;
        this.setState({isLoading: true});
        try {
            await Auth.signUp({
                username, password,
                attributes: {
                    email,
                }
            });
            this.setState({ isLoading: false, authState: "confirm" })
        } catch (error) {
            if (error.code === "UsernameExistsException"){
                this.history.push("/login")
            } else {
                this.setState({ isLoading: false });
                console.log('error signing up: ', error);
            }
        }
    }

    async confirmSignUp() {
        const { username, code } = this.state;
        this.setState({ isLoading: true });
        try {
            await Auth.confirmSignUp(username, code);
            this.setState({ isLoading: false, authState: "signedIn"});
        } catch (error) {
            this.setState({ isLoading: false });
            console.log('error confirming sign up', error);
        }
    }

    async signOut() {
        try {
            await Auth.signOut();
            this.setState({ authState: "signUp" });
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
                {authState === "signUp" && (
                    <>
                        <button className="button !normal ~neutral my-4" onClick={() => {
                            Auth.federatedSignIn({ provider: 'Google' });
                        }}>Sign up with Google</button>
                        <Link to="/projects"><button className="button !low ~neutral my-4">Log in</button></Link>
                        <h3>Or, sign up with username</h3>
                        <form onSubmit={this.handleSignUpSubmit}>
                            <p className="label">Username:</p>
                            <input type="text" className="field ~neutral !normal w-auto my-1" value={this.state.username} onChange={this.handleFieldUsername}></input>
                            <p className="label">Email:</p>
                            <input type="text" className="field ~neutral !normal w-auto my-1" value={this.state.email} onChange={this.handleFieldEmail}></input>
                            <p className="label">Password:</p>
                            <input type="password" className="field ~neutral !normal w-auto my-1" value={this.state.password} onChange={this.handleFieldPassword}></input>
                            <input type="submit" className="button field w-auto block my-4"></input>
                        </form>
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
                {authState === "signedIn" && (
                    <>
                        <p className="aside ~info my-4">Successfully signed up!</p>
                        <button className="button !normal ~neutral my-4" onClick={() => this.signOut()}>Log out</button>
                    </>
                )}
            </>
        )
    };

}

export default withRouter(SignUp);