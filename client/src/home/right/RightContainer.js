import React, { Component } from "react";
import Link from '@mui/material/Link';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { logout } from "../../index";

class RightContainer extends Component {

    render() {
        return (
            <div id="right-container">
                <div id="row-hello-logout">
                    <div className="username-image-container">
                        <h1>Hello <span className="username-zone">{this.props.user.username}</span></h1>
                        <a href="/">
                            {this.props.user.image && (
                                <img src={this.props.user.image} alt='' className="user-image"></img>
                            )}
                            {!this.props.user.image && (
                                <AccountCircleIcon className="user-image" />
                            )}
                        </a>
                    </div>
                    <Link id="logout-link" href='#' onClick={logout} tabIndex="0">
                        Log out
                    </Link>
                </div>
            </div>
        );
    }
}

export default RightContainer;