import React, { Component } from "react";
import $ from "jquery";

import "./loader.scss";
import "./left/left-container.scss";
import "./middle/middle-container.scss";
import "./right/right-container.scss";
import "./style.scss";

import { logout, prepareHeaders } from "../index";

import LeftContainer from "./left/LeftContainer";
import MiddleContainer from "./middle/MiddleContainer";
import RightContainer from "./right/RightContainer";

const io = require("socket.io-client");


class HomeContainer extends Component {
    constructor(props) {
        super(props);

        this.user = {
            username: "",
            email: "",
            password: "",
            pwconfirm: ""
        };

        this.channels = [];

        this.state = {
            user: "",
            selectedChannel: "",
            messages: [],
            errors: {},
        };

        this.handleReceiveMessage = this.handleReceiveMessage.bind(this);

        this.socket = io("http://localhost:3000");
    }

    async componentDidMount() {
        await this.getUser();
        this.initialLoader();

        // For each channel, start listeners for new messages and seen/received signals
        this.channels.forEach((channel) => {

            // Listen for new messages
            this.socket.on(`SEND_MESSAGE_TO_CLIENTS_${channel.id}`, (data) => {
                const message = data.message;
                message.user = data.user;
                message.users = [];

                // If we don't already have this message, we push it in this.channels
                if (!channel.messages.map(m => m.id).includes(message.id)) {
                    channel.messages.push(message);
                }

                // Listen for received signals
                this.socket.on(`TELL_CLIENTS_MESSAGE_IS_RECEIVED_${message.id}`, (data) => {
                    const user_message = data.user_message;
                    const user = data.user;
                    user.User_Message = user_message;

                    let found = false;
                    message.users.forEach((u) => {
                        if (u.id === user.id) {
                            found = true;
                            u = user;
                        }
                    });

                    if (!found) {
                        message.users.push(user);
                    }
                });

                // Listen for seen signals
                this.socket.on(`TELL_CLIENTS_MESSAGE_IS_SEEN_${message.id}`, (data) => {
                    const user_message = data.user_message;
                    const user = data.user;
                    user.User_Message = user_message;

                    let found = false;
                    message.users.forEach((u) => {
                        if (u.id === user.id) {
                            found = true;
                            u = user;
                        }
                    });

                    if (!found) {
                        message.users.push(user);
                    }
                });
            });

            // For already received messages, listen for the received/seen signals
            if (channel.messages) {
                channel.messages.forEach((message) => {
                    // Listen for received signals
                    this.socket.on(`TELL_CLIENTS_MESSAGE_IS_RECEIVED_${message.id}`, (data) => {
                        const user_message = data.user_message;
                        const user = data.user;
                        user.User_Message = user_message;

                        let found = false;
                        message.users.forEach((u) => {
                            if (u.id === user.id) {
                                found = true;
                                u = user;
                            }
                        });

                        if (!found) {
                            message.users.push(user);
                        }
                    });

                    // Listen for seen signals
                    this.socket.on(`TELL_CLIENTS_MESSAGE_IS_SEEN_${message.id}`, (data) => {
                        const user_message = data.user_message;
                        const user = data.user;
                        user.User_Message = user_message;

                        let found = false;
                        message.users.forEach((u) => {
                            if (u.id === user.id) {
                                found = true;
                                u = user;
                            }
                        });

                        if (!found) {
                            message.users.push(user);
                        }
                    });
                })
            }
        })
    }

    initialLoader() {
        $('body').removeClass('noscroll');

        var container = $('#initial-loader-container');
        var loadText = `Welcome aboard ${this.user.username} . . .`;
        $.each(loadText.split(''), function (i, letter) {
            setTimeout(function () {
                $('#loader-text').html($('#loader-text').html() + letter);
            }, 100 * i);
        });

        setTimeout(function () {
            container.animate(
                {
                    opacity: 0
                },
                2000
            );
            setTimeout(() => {
                container.remove();
            }, 2000);
        }, 3000);
    }

    getUser() {
        return new Promise((resolve, reject) => {
            fetch('/users/me', {
                headers: prepareHeaders(),
            }).then(response => response.json())
                .then(data => {
                    if (data.user) {
                        this.user = data.user;
                        this.channels = data.user.channels;
                        this.setState(state =>
                            Object.assign({}, state, {
                                user: data.user,
                            })
                            , () => {
                                // Set the first channel of the list as the selected one.
                                this.changeChannel(data.user.channels[0], 0);
                                resolve();
                            });
                    } else {
                        // If there a problem with token, the easiest solution is
                        // to logout.
                        if ('authentication' in data.errors) {
                            logout();
                        }

                        this.setState(state =>
                            Object.assign({}, state, {
                                errors: data.errors
                            })
                        );
                        reject();
                    }
                }).catch(err => {
                    console.log(err);
                });
        });
    }


    changeChannel = (channel) => {
        this.setState(state =>
            Object.assign({}, state, {
                selectedChannel: channel,
            })
        );
    }

    handleReceiveMessage(data) {
        const message = data.message;
        const messages = this.state.messages;
        messages.push(message);
        this.setState(state =>
            Object.assign({}, state, {
                messages: messages
            })
        );

        // Save message in this.channels
        const previousIndex = this.channels.findIndex(c => c.id === message.channelId);
        this.channels.splice(previousIndex, 1, this.state.selectedChannel);
    };

    render() {
        return (
            <main>
                <div id="initial-loader-container">
                    <div id="initial-loader" className="padded">
                        <span id="loader-text"></span>
                    </div>
                </div>
                <LeftContainer selectedChannel={this.state.selectedChannel} channels={this.channels} user={this.state.user} parentChangeChannel={this.changeChannel} socket={this.socket} />
                <MiddleContainer key={this.state.selectedChannel.id} channel={this.state.selectedChannel} user={this.state.user} socket={this.socket} />
                <RightContainer user={this.state.user} />
            </main>
        );
    }
}

export default HomeContainer;