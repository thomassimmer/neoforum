import React, { Component } from "react";
import TextField from '@mui/material/TextField';
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import SendIcon from '@mui/icons-material/Send';
import $ from "jquery";

import Message from './Message';

class MiddleContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            channel: this.props.channel,
            messages: this.props.channel.messages,
            message: ''
        }

        this.keyPress = this.keyPress.bind(this);
        this.handleSendMessage = this.handleSendMessage.bind(this);

        // Listen for new messages
        this.props.socket.on(`SEND_MESSAGE_TO_CLIENTS_${this.props.channel.id}`, (data) => {
            const message = data.message;
            const messages = this.state.messages;
            
            message.user = data.user;
            message.users = [];

            // If we don't already have this message, we push it in this.channels
            if (!messages.map(m => m.id).includes(message.id)) {
                messages.push(message);
            }

            this.setState(state =>
                Object.assign({}, state, {
                    messages: messages,
                })
            );
        });
    }

    componentDidMount() {
        this.setScrollToBottom();
    };

    componentDidUpdate() {
        this.setScrollToBottom();
    };

    setScrollToBottom() {
        const listMessage = $(".list-message");

        if (listMessage.length > 0)
            listMessage.scrollTop(listMessage[0].scrollHeight);
    };

    handleSendMessage(e) {
        e.preventDefault();
        if (this.state.message.trim() && this.props.user.id) {
            this.props.socket.emit('SEND_MESSAGE_TO_SERVER', {
                content: this.state.message,
                userId: this.props.user.id,
                channelId: this.state.channel.id,
            });
        }
        this.setState(state =>
            Object.assign({}, state, {
                message: ''
            })
        );
    };

    keyPress(e) {
        if (e.key === 'Enter') {
            this.handleSendMessage(e);
        } else {
            this.setState(state =>
                Object.assign({}, state, {
                    message: e.target.value
                })
            );
        }
    };

    render() {
        return (
            this.state.messages
                ? <div id="middle-container">
                    <h1>{this.state.channel.name}</h1>
                    <ul className="list-message">
                        {this.state.messages.map((message, index) => <Message key={index} message={message} user={this.props.user} socket={this.props.socket}/>)}
                    </ul>
                    <TextField
                        id="message-field"
                        label="Send a message"
                        fullWidth
                        variant="outlined"
                        className="message-field-container"
                        value={this.state.message}
                        onKeyDown={this.keyPress}
                        onChange={this.keyPress}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    <IconButton onClick={this.handleSendMessage}>
                                        <SendIcon fontSize="large" style={{ color: 'rgb(25, 118, 210)' }} />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </div>
                :
                <div id="middle-container">
                    <div className="loader"></div>
                </div>
        );
    };
}

export default MiddleContainer;