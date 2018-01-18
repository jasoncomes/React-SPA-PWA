import React, { Component } from 'react';
import Header from './Header';

class LoginContainer extends Component {

    // State.
    state = {
        email: '',
        password: '',
        error: ''
    }


    // #render ~ Input Change -> Update State
    handleInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }


    // #render ~ Form button Event -> Login || Update Error State
    handleSubmit = (event) => {
        event.preventDefault()

        if (this.state.email && this.state.password) {
            this.login()
        } else {
            this.setState({ error: 'Please fill in both fields.' })
        }
    }


    // #handleSubmit -> Firebase Login -> #onLogin || (#signUp || Update Error State)
    login() {
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(res => { 
                this.onLogin()
            })
            .catch(err => { 
                if (err.code === 'auth/user-not-found') {
                    this.signUp();
                } else {
                    this.setState({ error: 'Error logging in.' })
                }
            })
    }


    // #login -> Firebase Signup -> #onLogin || Update Error State
    signUp() {
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(res => {
                this.onLogin()
            })
            .catch(err => {
                this.setState({ error: 'Error signing up.' })
            })
    }


    // #login || #signup -> Route HTML5 History Redirect to /
    onLogin() {
        this.props.history.push('/')
    }


    // Render.
    render() {
        return (
            <div id="LoginContainer" className="inner-container">
                <Header />
                <form onSubmit={this.handleSubmit}>
                    <p>Sign in or sign up by entering your email and password.</p>
                    <input 
                        name="email"
                        type="text" 
                        placeholder="Your email"
                        onChange={this.handleInputChange}
                        value={this.state.email} />
                    <input 
                        name="password"
                        type="password" 
                        placeholder="Your password"
                        onChange={this.handleInputChange}
                        value={this.state.password} />
                    <p className="error">{this.state.error}</p>
                    <button className="red light" type="submit">Login</button>
                </form>
            </div>
        )
    };
};

export default LoginContainer;