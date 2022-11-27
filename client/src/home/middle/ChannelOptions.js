import React from "react";

const ChannelOptions = ({ user, channel }) => {

    // const deleteHandler = () => {
    //     if (window.confirm('Do you really want to delete this message ?')) {
    //         deleteMessage();
    //     }
    // }

    const followers = channel.users.map((u) => u.username);

    return (
        <ul className="channel-options-list">
            <li tabIndex="0" className="element-with-tooltip">
                Unfollow
                <span className="tooltip">Not available yet 😟</span>
            </li>
            <li tabIndex="0" className="element-with-tooltip">
                Followed by...
                {followers.length ?
                    <ul className="tooltip">
                        {followers.map((username, index) => {
                            return <li key={index}>{username}</li>;
                        })}
                    </ul>
                    :
                    <ul className="tooltip">
                        Nobody 😟
                    </ul>
                }
            </li>
        </ul>
    )
};

export default ChannelOptions;