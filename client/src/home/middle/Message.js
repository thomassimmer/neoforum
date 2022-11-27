import React, { Component } from "react";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import $ from 'jquery';

import MessageOptions from "./MessageOptions";


class Message extends Component {
    constructor(props) {
        super(props);

        this.seen = [];
        this.received = [];

        this.props.message.users.forEach((user) => {
            if (user.User_Message.seen) {
                this.seen.push(user);
            }
            if (user.User_Message.received) {
                this.received.push(user);
            }
        });

        this.state = {
            content: this.props.message.content,
            seen: this.seen,
            received: this.received,
            optionsAreVisible: false,
        }
    }

    componentDidMount() {
        // Emit the seen signal
        if (!this.seen.map(user => user.id).includes(this.props.user.id)) {

            this.props.socket.emit('TELL_SERVER_MESSAGE_IS_SEEN', {
                userId: this.props.user.id,
                messageId: this.props.message.id
            });
        }

        // If not received, listen for received signal
        this.props.socket.on(`TELL_CLIENTS_MESSAGE_IS_RECEIVED_${this.props.message.id}`, (data) => {
            const user = data.user;
            const received = this.state.received;

            if (!received.map((u) => u.id).includes(user.id)) {
                received.push(user);
                this.setState(state =>
                    Object.assign({}, state, {
                        received: received,
                    })
                );
            }
        });

        // If not seen, listen for seen signal
        this.props.socket.on(`TELL_CLIENTS_MESSAGE_IS_SEEN_${this.props.message.id}`, (data) => {
            const user = data.user;
            const seen = this.state.seen;

            if (!seen.map((u) => u.id).includes(seen.id)) {
                seen.push(user);
                this.setState(state =>
                    Object.assign({}, state, {
                        seen: seen,
                    })
                );
            }
        });
    };

    deleteMessage = () => {
        // Pass token too so we can check in back that it's the actual author
        // who is deleting.
        this.props.socket.emit('TELL_SERVER_DELETE_MESSAGE', {
            userId: this.props.user.id,
            messageId: this.props.message.id,
            token: localStorage.token,
        });
    }

    render() {
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
            if (!$(e.target).parent('ul.message-options-list').length) {
                this.setState(state =>
                    Object.assign({}, state, {
                        optionsAreVisible: false,
                    })
                );
                $(window).off('click', hideOptions);
            }
        };

        if (this.props.message.deleted || !this.props.message.user) {
            return <li className="deleted-message">Message deleted by author.</li>;
        } else {
            return (
                <li className="message">
                    {/* TODO : Redirect toward conversation with this user */}
                    <a href="#" className="user-image-container">
                        {this.props.message.user.image
                            ? <img src={this.props.message.user.image} alt='' className="user-image"></img>
                            : <img src='default-user-img.png' alt='' className="user-image"></img>
                        }
                    </a>
                    <div className="container-username-date">
                        {/* TODO : Redirect toward conversation with this user */}
                        <a href="#" className="user-username">{this.props.message.user.username}</a>
                        <span className="message-date">{new Date(Date.parse(this.props.message.user.createdAt)).toLocaleString()}</span>
                    </div>
                    <span className="message-content">{this.state.content}</span>
                    <MoreHorizIcon
                        tabIndex="0"
                        className={`message-options${this.state.optionsAreVisible ? ' focus' : ''}`}
                        onClick={showOptions}
                        onKeyDown={showOptions}
                    />
                    {this.state.optionsAreVisible
                        ? <MessageOptions
                            user={this.props.user}
                            message={this.props.message}
                            seen={this.state.seen}
                            received={this.state.received}
                            deleteMessage={this.deleteMessage} />
                        : null}
                </li>
            );
        }
    }
}
export default Message;