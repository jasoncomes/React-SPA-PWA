import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import Header from './Header'


export default class ChatContainer extends Component {

    // State.
    state = {
        newMessage: ''
    }


    // Mount -> #scrollToBottom
    componentDidMount() {
        this.scrollToBottom()
    }


    // Props Update -> #scrollToBottom
    componentDidUpdate(previousProps) {
        if (previousProps.messages.length !== this.props.messages.length) {
            this.scrollToBottom()
        }
    }


    // #componentDidMount || #componentDidUpdate -> Scroll to bottom of Messages.
    scrollToBottom = () => {
        const messageContainer = ReactDOM.findDOMNode(this.messageContainer)

        if (messageContainer) {
            messageContainer.scrollTop = messageContainer.scrollHeight
        }
    }


    // #render ~ Logout button onClick -> Firebase Logout Method
    handleLogoutClick = () => {
        firebase
            .auth()
            .signOut()
    }


    // #render ~ Message onChange Event -> Update NewMessage State.
    handleMessageChange = (event) => {
        this.setState({ newMessage: event.target.value })
    }


    // #render ~ KeyDown Event -> #submitForm
    handleMessageKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            this.handleSubmit()
        }
    }


    // #render ~ OnClick Event || #handleMessageKeyDown -> Submit Props OnSubmit then Update New Messages State to blank.
    handleSubmit = () => {
        this.props.onSubmit(this.state.newMessage)
        this.setState({ newMessage: '' })
    }


    // #render -> Display author after message groupings.
    getAuthor = (msg, nextMsg) => {
        if (!nextMsg || nextMsg.author !== msg.author) {
            return (
                <p className="author">
                    <Link to={`/users/${msg.user_id}`}>{msg.author}</Link>
                </p>
            )
        }
    }


    // Render.
    render() {
        return (
            <div id="ChatContainer" className="inner-container">

                <Header>
                    <button className="red" onClick={this.handleLogoutClick}>Logout</button>
                </Header>

                {this.props.messagesLoaded ? (
                    <div id="message-container" ref={element => { this.messageContainer = element }}>
                        {
                            this.props.messages.map((msg, i) => (
                                <div 
                                    key={msg.id} 
                                    className={`message ${this.props.user.email === msg.author && 
                                        'mine'
                                    }`}
                                >
                                    <p>{msg.msg}</p>
                                    {this.getAuthor(msg, this.props.messages[i + 1])}
                                </div>
                            ))
                        }
                    </div>
                ) : (
                    <div id="loading-container">
                        <img src="/assets/icon.png" alt="Logo" id="loader" />
                    </div>
                )}
                
                <div id="chat-input">
                    <textarea 
                        placeholder="Add your message..." 
                        onChange={this.handleMessageChange}
                        onKeyDown={this.handleMessageKeyDown}
                        value={this.state.newMessage} 
                    />
                    <button onClick={this.handleSubmit}>
                        <svg viewBox="0 0 24 24">
                            <path fill="#424242" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                        </svg>
                    </button>
                </div>
            </div>
        )
    }
}

