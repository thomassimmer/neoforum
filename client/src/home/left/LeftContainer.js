import React, { Component } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
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

    componentDidMount() {
        $('.close-left-container-btn').on('click', () => {
            $('#left-container').removeClass('open');
        })
    }

    changeChannel = (event) => {
        const channel = this.state.channels[event.currentTarget.value];
        this.props.parentChangeChannel(channel);

        if (this.lastFocusedElement) {
            $(`li[value=${this.lastFocusedElement}]`).removeClass('focus');
        }

        $(event.currentTarget).addClass('focus');
        this.lastFocusedElement = event.currentTarget.value;

        $('#left-container').removeClass('open');
    }

    render() {
        return (
            <div id="left-container">
                <header>
                    <h1>Channels</h1>
                    <IconButton className="close-left-container-btn">
                        <CloseIcon fontSize="large" style={{ color: 'white' }} />
                    </IconButton>
                </header>
                <SearchBar
                    showResultDataFromSearchBar={this.props.showResultDataFromSearchBar}
                />
                <ul id="subscribed-channels">
                    {this.state.channels && this.props.selectedChannel && this.state.channels.map((channel, index) => {
                        const shouldBeFocused = this.props.selectedChannel.id === channel.id;
                        if (shouldBeFocused)
                            this.lastFocusedElement = index;
                        return <Channel
                            key={channel.name}
                            listItemIndex={index}
                            channel={channel}
                            user={this.props.user}
                            changeChannel={this.changeChannel}
                            // onClick={this.changeChannel}
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