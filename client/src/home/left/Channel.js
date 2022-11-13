import React, { Component } from "react";

class Channel extends Component {
    constructor(props) {
        super(props);

        let numberUnreadMessages = 0;
        if (this.props.channel.messages) {
            this.props.channel.messages.forEach((message) => {
                if (message.users) {
                    message.users.forEach((user) => {
                        let received = false;

                        if (user.id === this.props.user.id) {
                            received = true;
                            if (!user.User_Message.seen) {
                                numberUnreadMessages++;
                            }
                        };

                        if (!received) {
                            this.props.socket.emit('TELL_SERVER_MESSAGE_IS_RECEIVED', {
                                userId: this.props.user.id,
                                messageId: message.id
                            });
                        }
                    });
                }

                // Start listening for seen signal
                this.props.socket.on(`TELL_CLIENTS_MESSAGE_IS_SEEN_${message.id}`, this.decreaseNumberUnreadWhenMessageSeen);
            });
        }

        this.state = {
            numberUnreadMessages: numberUnreadMessages,
        };

        this.props.socket.on(`SEND_MESSAGE_TO_CLIENTS_${this.props.channel.id}`, (data) => {
            const message = data.message;

            // Increase selected increase the number of unread messages
            if (message.userId !== this.props.user.id && !this.props.selected) {
                this.setState(state =>
                    Object.assign({}, state, {
                        numberUnreadMessages: state.numberUnreadMessages + 1,
                    })
                );

                // Emit the received signal
                // Note: If the channel is selected, we already send a TELL_SERVER_MESSAGE_IS_SEEN
                // signal, which will set the message as received.
                this.props.socket.emit('TELL_SERVER_MESSAGE_IS_RECEIVED', {
                    userId: this.props.user.id,
                    messageId: message.id
                });

                // Start listening for seen signal

                this.props.socket.on(`TELL_CLIENTS_MESSAGE_IS_SEEN_${message.id}`, this.decreaseNumberUnreadWhenMessageSeen);
            }

        });
    }

    decreaseNumberUnreadWhenMessageSeen = (data) => {
        const user = data.user;

        if (user.id === this.props.user.id) {
            this.setState(state =>
                Object.assign({}, state, {
                    numberUnreadMessages: state.numberUnreadMessages - 1,
                })
            );

            // Stop listening
            this.props.socket.off(`TELL_CLIENTS_MESSAGE_IS_SEEN_${data.user_message.messageId}`, this.decreaseNumberUnreadWhenMessageSeen);
        }

    }

    keyDownHandlerForChangingChannel = (event) => {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            this.props.changeChannel(event);
        }
    }

    render() {

        let channelName = '';

        if (this.props.channel.isPrivate) {
            let userInsidePrivateChannelWithoutMe = [];

            this.props.channel.users.forEach((user) => {
                if (user.id !== this.props.user.id) {
                    userInsidePrivateChannelWithoutMe.push(user);
                }
            });

            channelName = userInsidePrivateChannelWithoutMe.map(u => u.username).join(', ');

            // If there is no one else, then it's a conversation with myself
            if (channelName === '') {
                channelName = 'Me';
            }
        } else {
            channelName = this.props.channel.name;
        }

        return (
            <li key={this.props.listItemIndex} value={this.props.listItemIndex} tabIndex="0" onKeyDown={this.keyDownHandlerForChangingChannel} onClick={this.props.changeChannel} className={this.props.selected ? 'focus' : ''}>
                <span>{channelName}</span>
                {this.state.numberUnreadMessages > 0 && (
                    <div className="number-unread-messages">
                        <span >{this.state.numberUnreadMessages}</span>
                    </div>
                )}
            </li>
        );
    }
}

export default Channel;