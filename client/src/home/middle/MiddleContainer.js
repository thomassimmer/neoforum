import React, { Component } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from "@mui/icons-material/Search";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import $ from "jquery";

import Message from './Message';
import ChannelOptions from "./ChannelOptions";
import { prepareHeaders } from "../../index";

class MiddleContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            channel: this.props.channel,
            messages: this.props.channel.messages || [],
            message: '',
            userAlreadyJoined: this.props.channel.users && this.props.channel.users.map(u => u.id).includes(this.props.user.id),
        }

        this.keyPress = this.keyPress.bind(this);
        this.handleSendMessage = this.handleSendMessage.bind(this);

        // Listen for new messages
        this.props.socket.on(`SEND_MESSAGE_TO_CLIENTS_${this.props.channel.id}`, (data) => {
            const message = data.message;
            const messages = this.state.messages;

            message.user = data.user;
            message.users = [];

            // If we don't already have this message, we push it in this.state.messages
            if (!messages.map(m => m.id).includes(message.id)) {
                messages.push(message);
            }

            this.setState(state =>
                Object.assign({}, state, {
                    messages: messages,
                })
            );
        });

        this.props.socket.on(`TELL_CLIENTS_MESSAGE_IS_DELETED_${this.props.channel.id}`, (data) => {
            const markMessageAsDelete = (m) => {
                if (m.id === data.messageId) {
                    m.deleted = true;
                    m.content = null;
                    m.user = null;
                    m.attachment = null;
                }
            };
            const channel = this.state.channel;
            channel.messages.forEach(markMessageAsDelete);
            const messages = this.state.messages;
            messages.forEach(markMessageAsDelete);

            this.setState(state =>
                Object.assign({}, state, {
                    messages: messages,
                    channel: channel,
                })
            );
        });
    }

    componentDidMount() {
        this.setScrollToBottom();

        $('.open-left-container-btn').on('click', () => {
            $('#left-container').addClass('open');
        })

        $('.open-right-container-btn').on('click', () => {
            $('#right-container').addClass('open');
        })
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
                token: localStorage.token,
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

    joinChannel = async () => {
        const response = await fetch(`/channels/join/${this.state.channel.id}`, {
            headers: prepareHeaders(),
        });

        if (response.ok) {
            const json = await response.json();

            this.props.socket.emit('TELL_SERVER_YOU_JOINED_A_CHANNEL', {
                users: json.users,
                channelId: this.state.channel.id,
            });

            this.props.socket.on(`${this.props.user.id}_JOINED_A_CHANNEL`, () => {
                setTimeout(() => {
                    this.props.changeChannel(this.state.channel.id);
                }, 10);
            })
        }
    }

    render() {

        let channelName = '';

        if (this.state.channel.isPrivate) {
            let userInsidePrivateChannelWithoutMe = [];

            if (this.state.channel.users) {
                this.state.channel.users.forEach((user) => {
                    if (user.id !== this.props.user.id) {
                        userInsidePrivateChannelWithoutMe.push(user);
                    }
                });
            } else {
                userInsidePrivateChannelWithoutMe.push(this.state.channel.user);
            }

            channelName = userInsidePrivateChannelWithoutMe.map(u => u.username).join(', ');
        } else {
            channelName = this.state.channel.name;
        }

        const showOptions = (e) => {
            e.stopPropagation();

            this.setState(state =>
                Object.assign({}, state, {
                    optionsAreVisible: !state.optionsAreVisible,
                })
            );

            setTimeout(() => {
                $(window).on('click', hideOptions);
            }, 10);
        }

        const hideOptions = (e) => {
            if (!$(e.target).parent('ul.channel-options-list').length) {
                this.setState(state =>
                    Object.assign({}, state, {
                        optionsAreVisible: false,
                    })
                );
                $(window).off('click', hideOptions);
            }
        };

        return (
            <div id="middle-container">
                <header>
                    <IconButton className="open-left-container-btn">
                        <SearchIcon fontSize="large" style={{ color: 'white' }} />
                    </IconButton>
                    <div className="useless-div-for-flex"></div>
                    <h1>{channelName}</h1>
                    <MoreHorizIcon
                        tabIndex="0"
                        className={`channel-options${this.state.optionsAreVisible ? ' focus' : ''}`}
                        onClick={showOptions}
                        onKeyDown={showOptions}
                    />
                    {this.state.optionsAreVisible
                        ? <ChannelOptions
                            user={this.props.user}
                            channel={this.state.channel} />
                        : null}
                    <div className="user-image-container open-right-container-btn">
                        <img src={this.props.user.image} alt='' className="user-image"></img>
                    </div>
                </header>
                {this.state.messages.length > 0 ?
                    <ul className="list-message">
                        {this.state.messages.map((message, index) => {
                            return <Message key={index} message={message} user={this.props.user} socket={this.props.socket} />;
                        })}
                    </ul>
                    :
                    <div className="no-message-yet">No message yet in here...</div>
                }
                <footer>
                    {this.state.userAlreadyJoined ?
                        <TextField
                            id="message-field"
                            label="Send a message"
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
                        :
                        <Button
                            variant="outlined"
                            className="join-channel-container"
                            fullWidth
                            onClick={this.joinChannel}
                        >
                            Join this {this.state.channel.isPrivate ? 'conversation' : 'channel'}
                        </Button>
                    }
                </footer>
            </div>
        );
    };
}

export default MiddleContainer;