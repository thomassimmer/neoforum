import React, { Component } from "react";
import $ from 'jquery';

import Channel from "./Channel";
import SearchBar from "./SearchBar";

class LeftContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            channels: this.props.channels,
        }

        this.lastFocusedElement = null;

        this.props.socket.on(`${this.props.user.id}_JOINED_A_CHANNEL`, () => {
            // To update positions of channels
            this.setState(state =>
                Object.assign({}, state, {
                    channels: this.props.channels
                })
            );
        });

        this.props.channels.forEach((channel) => {
            this.props.socket.on(`SEND_MESSAGE_TO_CLIENTS_${channel.id}`, (data) => {
                // To update positions of channels
                this.setState(state =>
                    Object.assign({}, state, {
                        channels: this.props.channels
                    })
                );
            });
        });
    }

    changeChannel = (event) => {
        const channel = this.state.channels[event.target.value];
        this.props.parentChangeChannel(channel);
        if (this.lastFocusedElement)
            $(`li[value=${this.lastFocusedElement}]`).removeClass('focus');
        $(event.target).addClass('focus');
        this.lastFocusedElement = event.target.value;
    }

    render() {
        return (
            <div id="left-container">
                <h1>Channels</h1>
                <SearchBar
                    showResultDataFromSearchBar={this.props.showResultDataFromSearchBar}
                />
                <ul id="subscribed-channels">
                    {this.state.channels.map((channel, index) => {
                        const shouldBeFocused = this.props.selectedChannel.id === channel.id;
                        if (shouldBeFocused)
                            this.lastFocusedElement = index;
                        return <Channel
                            key={channel.name}
                            listItemIndex={index}
                            channel={channel}
                            user={this.props.user}
                            changeChannel={this.changeChannel}
                            onClick={this.changeChannel}
                            selected={shouldBeFocused}
                            socket={this.props.socket}
                        />;
                    })}
                </ul>
            </div>
        );
    }
}

export default LeftContainer;