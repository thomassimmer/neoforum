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

    render() {
        const showOptions = (e) => {
            this.setState(state =>
                Object.assign({}, state, {
                    optionsAreVisible: true,
                })
            );

            setTimeout(() => {
                $(window).on('click', hideOptions);
            }, 10);
        }

        const hideOptions = () => {
            this.setState(state =>
                Object.assign({}, state, {
                    optionsAreVisible: false,
                })
            );
            $(window).off('click', hideOptions);
        };

        return (
            <li className="message">
                <a href="/" className="user-image-container">
                    {this.props.message.user.image
                        ? <img src={this.props.message.user.image} alt='' className="user-image"></img>
                        : <img src='default-user-img.png' alt='' className="user-image"></img>
                    }
                </a>
                <div>
                    <a href="/" className="user-username">{this.props.message.user.username}</a>
                </div>
                <span className="message-content">{this.state.content}</span>
                <MoreHorizIcon className={`message-options${this.state.optionsAreVisible ? ' focus' : ''}`} onClick={showOptions} />
                {this.state.optionsAreVisible ? <MessageOptions /> : null}
                {/* Add somewhere seen/received info */}
            </li>
        );
    };
}

export default Message;