import React, { Component } from "react";
import ReactDOM from 'react-dom/client';
import Link from '@mui/material/Link';

import './index.css';

import LoginContainer from "./authentication/LoginContainer";
import HomeContainer from "./home/HomeContainer";

const root = ReactDOM.createRoot(document.getElementById('root'));

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            shouldShowSignUpForm: false
        };
    };

    showSignUpForm = (event) => {
        event.preventDefault();
        this.setState(state =>
            Object.assign({}, state, {
                shouldShowSignUpForm: !this.state.shouldShowSignUpForm
            })
        );
    };

    isAuthenticated = () => {
        return localStorage.isAuthenticated === "true";
    }

    render() {
        return (
            this.isAuthenticated() ?
                <HomeContainer />
                :
                <div>
                    {!this.state.shouldShowSignUpForm && (
                        <Link onClick={this.showSignUpForm} id='enterButton'>
                            ENTER
                        </Link>
                    )}
                    {this.state.shouldShowSignUpForm && (
                        <LoginContainer />
                    )}
                </div>
        );
    }
};

root.render(
    <Home />
);