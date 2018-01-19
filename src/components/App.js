import React, { Component } from 'react'
import { Route, withRouter } from 'react-router-dom'
import Header from './Header'
import LoginContainer from './LoginContainer'
import ChatContainer from './ChatContainer'
import UserContainer from './UserContainer'
import NotificationResource from '../resources/NotificationResource'
import './app.css'


class App extends Component {

    // State.
    state = {
        user: null,
        messages: [],
        messagesLoaded: false
    }
    deferredPrompt = null


    // Mount -> User State Change && Messages Value Change - Firebase Event Listeners.
    componentDidMount() {

        // Service Worker - Notifcation Resource
        this.notifications = new NotificationResource(
            firebase.messaging(), 
            firebase.database()
        )

        // User State Change.
        firebase
            .auth()
            .onAuthStateChanged(user => {      
                if (user) {        
                    this.setState({ user })
                    this.listenForMessages()
                    this.notifications.changeUser(user)
                } else {
                    this.props.history.push('/login')
                }
            })

        this.listenForMessages()        
        this.listenForInstallBanner()
    }


    // #mount -> Listen for Updated Messages
    listenForMessages = () => {
        firebase
            .database()
            .ref('/messages')
            .on('value', snapshot => {
                this.onMessage(snapshot)

                if (!this.state.messagesLoaded) {
                    this.setState({ messagesLoaded: true })
                }
            })
    }


    // #mount -> Event Listener for Before Install Prompt then store it for later.
    listenForInstallBanner = () => {
        window.addEventListener('beforeinstallprompt', e => {
            e.preventDefault()
            this.deferredPrompt = e
        })
    }


    // #componentDidMount -> Ref Message Value Change -> Update Messages State.
    onMessage = snapshot => {
        const messages = Object.keys(snapshot.val()).map(key => {
            const msg = snapshot.val()[key]
            msg.id = key

            return msg
        })
        this.setState({ messages })
    }


    // @ChatContainer#onSubmit -> Update Firebase Database Ref `Messages/` & Prompt User to Install to home.
    handleSubmitMessage = msg => {
        const data = {
            msg,
            author: this.state.user.email,
            user_id: this.state.user.uid,
            timestamp: Date.now()
        }

        firebase
            .database()
            .ref('messages/')
            .push(data)

        if (this.deferredPrompt) {
            this.deferredPrompt.prompt()

            this.deferredPrompt.userChoice.then(choice => {
                console.log(choice)
            })
            this.deferredPrompt = null
        }
    }


    // Render.
    render() {
        return (
            <div id="container" className="inner-container">
                <Route path="/login" component={LoginContainer} />
                <Route 
                    exact 
                    path="/" 
                    render={() => 
                        <ChatContainer 
                            onSubmit={this.handleSubmitMessage} 
                            messages={this.state.messages}
                            user={this.state.user}
                            messagesLoaded={this.state.messagesLoaded}
                        />
                    }
                />
                <Route 
                    path="/users/:id" 
                    render={({ history, match }) => 
                        <UserContainer
                            messages={this.state.messages}
                            messagesLoaded={this.state.messagesLoaded}
                            userID={match.params.id}
                        />
                    }
                />
            </div>
        )
    }
};

export default withRouter(App);