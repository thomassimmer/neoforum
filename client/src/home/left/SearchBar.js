// Inspired by https://dev.to/franciscomendes10866/how-to-create-a-search-bar-in-react-58nj

import React from "react";
import TextField from '@mui/material/TextField';
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import $ from 'jquery';

import useFetch from "../../hooks/useFetch";

const SearchBar = ({ showResultDataFromSearchBar }) => {

    const selectChannel = async (event) => {
        if (event.target.id.includes('channel_')) {
            const channelId = event.target.id.match(/channel_(\d*)/)[1];
            await showResultDataFromSearchBar('channel', channelId);
        } else {
            const userId = event.target.id.match(/user_(\d*)/)[1];
            await showResultDataFromSearchBar('user', userId);
        }
        setData({ ...data, slug: '' });
        $('#left-container').removeClass('open');
    }

    const keyDownHandlerForChangingChannel = (event) => {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            selectChannel(event.target);
        }
    };

    const { data, setData } = useFetch();

    return (
        <div className="search-bar">
            <TextField
                id="search-bar-field"
                label="Search a channel or a person"
                fullWidth
                variant="outlined"
                value={data.slug}
                onChange={(e) => setData({ ...data, slug: e.target.value })}
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
            {data.slug !== '' && (
                <div className="search-results-container">
                    {data.loading
                        ?
                        <div className="loading-container">
                            <span>Searching</span>
                            <div className="loader"></div>
                        </div>
                        : (data.channels.length > 0 || data.users.length > 0)
                            ?
                            <div>
                                {data.channels.length > 0 && (
                                    <div>
                                        <span>Channels</span>
                                        <ul>
                                            {data.channels.map((channel, index) => {
                                                const id = `channel_${channel.id}`;
                                                return (
                                                    <li
                                                        key={id}
                                                        id={id}
                                                        onClick={selectChannel}
                                                        onKeyDown={keyDownHandlerForChangingChannel}
                                                    >
                                                        {channel.name}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                                {data.users.length > 0 && (
                                    <div>
                                        <span>Users</span>
                                        <ul>
                                            {data.users.map((user, index) => {
                                                const id = `user_${user.id}`;
                                                return (
                                                    <li
                                                        key={id}
                                                        id={id}
                                                        onClick={selectChannel}
                                                        onKeyDown={keyDownHandlerForChangingChannel}
                                                    >
                                                        {user.username}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            : <span>No result found.</span>
                    }
                </div>
            )}
        </div>
    );
}

export default SearchBar;