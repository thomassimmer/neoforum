import React, { Component } from "react";
import Link from '@mui/material/Link';
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import $ from 'jquery';

import { logout, prepareHeaders } from "../../index";


class RightContainer extends Component {

    componentDidMount() {
        $('.close-right-container-btn').on('click', () => {
            $('#right-container').removeClass('open');
        })
    }

    deleteAccount = async () => {
        if (window.confirm('Do you really want to delete your account ? This action is irreversible.')) {
            const headers = prepareHeaders();
            const result = await fetch(`/users/${this.props.user.id}`, {
                method: "DELETE",
                headers: headers,
            });

            if (result.ok) {
                window.location.reload();
            }
        }
    }

    render() {

        const loadFile = async (event) => {
            const files = event.target.files
            const data = new FormData()
            data.append('image', files[0])

            const headers = prepareHeaders();
            const result = await fetch('/user/upload/img/', {
                method: 'POST',
                headers: headers,
                body: data,
            });

            if (result.ok) {
                window.location.reload();
            }
        };

        return (
            <div id="right-container">
                <header id="row-hello-logout">
                    <IconButton className="close-right-container-btn">
                        <CloseIcon fontSize="large" style={{ color: 'white' }} />
                    </IconButton>
                    <div className="username-image-container">
                        <h1>Hello <span className="username-zone">{this.props.user.username}</span></h1>
                        <div className="profile-pic">
                            <label htmlFor="file">
                                <span>Change image</span>
                            </label>
                            <input id="file" type="file" onChange={loadFile} />
                            {this.props.user.image
                                ? <img src={this.props.user.image} alt='' className="user-image"></img>
                                : <img src='default-user-img.png' alt='' className="user-image"></img>
                            }
                        </div>
                    </div>
                    <Link id="logout-link" href='#' onClick={logout} tabIndex="0">
                        Log out
                    </Link>
                </header>
                <Link id="delete-account-link" href='#' onClick={this.deleteAccount} tabIndex="0">
                    Delete my account
                </Link>
            </div>
        );
    }
}

export default RightContainer;