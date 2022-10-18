import React, { Component } from "react";
import Link from '@mui/material/Link';
import $ from 'jquery';

import "./style.css";

class HomeContainer extends Component {
    constructor(props) {
        super(props);

        this.user = {
            username: "",
            email: "",
            password: "",
            pwconfirm: ""
        };

        this.state = {
            errors: {},
        };
    }

    async componentDidMount() {
        await this.getUser();
        this.initialLoader();
    }

    initialLoader() {
        $('body').removeClass('noscroll');

        var container = $('#initial-loader-container');
        var loadText = `Welcome aboard ${this.user.username}.`;
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
            })
        }, 3000);
    }

    prepareHeaders = () => {
        if (localStorage.token) {
            return { 'x-access-token': localStorage.token };
        } else {
            return {};
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.isAuthenticated = false;
        window.location.reload();
    }

    getUser() {
        return new Promise((resolve, reject) => {
            fetch('/api/user', {
                headers: this.prepareHeaders()
            })
            .then(response => response.json())
            .then(data => {
                if (data.user) {
                    this.user = data.user;
                } else {
                    // If there a problem with token, the easiest solution is
                    // to logout. TODO: Improve
                    if (data.errors[0].name === "NoTokenError" ||
                        data.errors[0].name === "TokenExpiredError") {
                        this.logout();
                    }

                    this.setState(state =>
                        Object.assign({}, state, {
                            errors: data.errors
                        })
                    );
                }
                resolve();
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    render() {
        return (
            <div>
                <div id="initial-loader-container">
                    <div id="initial-loader" className="padded">
                        <span id="loader-text"></span>
                    </div>
                </div>
                <div className="footer">
                    <Link href="https://github.com/thomassimmer/neoforum">
                        Source
                    </Link>
                    &nbsp;-&nbsp;
                    <Link onClick={this.logout}>
                        Log out
                    </Link>
                </div>
            </div>
        );
    }
}

export default HomeContainer;