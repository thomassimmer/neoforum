import React, { Component } from "react";
import TextField from '@mui/material/TextField';
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import $ from 'jquery';

import Channel from "./Channel";

class LeftContainer extends Component {
    constructor(props) {
        super(props);

        this.lastFocusedElement = null;
    }

    changeChannel = (event) => {
        const channel = this.props.channels[event.target.value];
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
                <div className="search-bar">
                    <TextField
                        id="search-bar-field"
                        label="Search a channel or a person"
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    <IconButton>
                                        <SearchIcon fontSize="large" style={{ color: '#fff' }} />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </div>
                <ul>
                    {this.props.channels.map((channel, index) => {
                        const shouldBeFocused = this.props.selectedChannel.id === channel.id;
                        if (shouldBeFocused)
                            this.lastFocusedElement = index;
                        return <Channel key={index} listItemIndex={index} channel={channel} user={this.props.user} changeChannel={this.changeChannel} onClick={this.changeChannel} selected={shouldBeFocused} socket={this.props.socket}/>;
                    })}
                </ul>
            </div>
        );
    }
}

export default LeftContainer;