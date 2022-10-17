import React, { Component } from "react";
import Link from '@mui/material/Link';

class HomeContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            users: [],
            user: {
                username: "GG",
                email: "",
                password: "",
                pwconfirm: ""
            },
            btnTxt: "show",
            type: "password",
            score: "0",
            signup: false
        };
    }

    componentDidMount() {
        this.getListOfUser();
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

    getListOfUser() {
        fetch('/api/users', {
            headers: this.prepareHeaders()
        })
            .then(response => response.json())
            .then(data => {
                if (data.users) {
                    // Get user index
                    const toIndex = Math.floor(data.users.length / 2);

                    let userIndex;
                    Object.values(data.users).forEach((user, index) => {
                        if (user.username === this.state.user.username) {
                            userIndex = index;
                        }
                    });
                    const userToReplace = data.users.splice(userIndex, 1)[0];
                    data.users.splice(toIndex, 0, userToReplace);

                    this.setState(state =>
                        Object.assign({}, state, {
                            user: data.user,
                            users: data.users,
                        })
                    );
                } else {
                    this.setState(state =>
                        Object.assign({}, state, {
                            errors: data.errors
                        })
                    );
                }
            })
            .catch(err => {
                console.log("Error: ", err);
            });
    }

    render() {
        return (
            <div>
                <div className="homeContainer">
                    <div className="welcomeSentence">
                        Welcome aboard
                    </div>
                    <div className="usernamesContainer">
                        {
                            Object.values(this.state.users).map((user) => {
                                if (user.username === this.state.user.username) {
                                    return <div className="ownUsername">{user.username}</div>
                                }
                                return <div>{user.username}</div>
                            })
                        }
                    </div>
                    .
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