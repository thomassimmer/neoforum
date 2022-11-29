import React from "react";

const MessageOptions = ({ user, message, seen, received, deleteMessage }) => {

    const deleteHandler = () => {
        if (window.confirm('Do you really want to delete this message ?')) {
            deleteMessage();
        }
    }

    const userIsTheAuthor = user.id === message.user.id;

    return (
        <ul className="message-options-list">
            {userIsTheAuthor && (
                <li tabIndex="0" onClick={deleteHandler}>Delete</li>
            )}
            {userIsTheAuthor && (
                <li tabIndex="0" className="element-with-tooltip">
                    Edit
                    <span className="tooltip">Not available yet 😟</span>
                </li>
            )}
            <li tabIndex="0" className="element-with-tooltip">
                Seen by...
                <ul className="tooltip">
                    {seen && seen.map((um, index) => {
                        return <li key={index}>{um.username}</li>;
                    })}
                </ul>
            </li>
            <li tabIndex="0" className="element-with-tooltip">
                Received by...
                <ul className="tooltip">
                    {received && received.map((um, index) => {
                        return <li key={index}>{um.username}</li>;
                    })}
                </ul>
            </li>
        </ul>
    )
};

export default MessageOptions;