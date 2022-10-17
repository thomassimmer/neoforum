import React, { Component } from "react";
import SignUpForm from "./SignUpForm.js";
import SignInForm from "./SignInForm.js";
const FormValidators = require("./validators");
const validateSignUpForm = FormValidators.validateSignUpForm;
const zxcvbn = require("zxcvbn");

class LoginContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            user: {
                username: "",
                email: "",
                password: "",
                pwconfirm: ""
            },
            btnTxt: "show",
            type: "password",
            score: "0",
            signup: false
        };

        this.pwMask = this.pwMask.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submitSignup = this.submitSignup.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.pwHandleChange = this.pwHandleChange.bind(this);
    }

    handleChange(event) {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;

        this.setState({
            user
        });
    }

    pwHandleChange(event) {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;

        this.setState({
            user
        });

        if (event.target.value === "") {
            this.setState(state =>
                Object.assign({}, state, {
                    score: "null"
                })
            );
        } else {
            var pw = zxcvbn(event.target.value);
            this.setState(state =>
                Object.assign({}, state, {
                    score: pw.score + 1
                })
            );
        }
    }

    submitSignup(user) {
        var params = { username: user.usr, password: user.pw, email: user.email };
        fetch('api/auth/signup', {
            method: 'POST', 
            mode: 'cors',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params)
        })
        .then(response => response.json())
        .then(data => {
            if (data.accessToken) {
                localStorage.token = data.accessToken;
                localStorage.isAuthenticated = true;
                window.location.reload();
            } else {
                this.setState({
                    errors: data.message
                });
            }
        })
        .catch(err => {
            console.log("Sign up data submit error: ", err);
        });
    }

    submitSignin(user) {
        var params = { username: user.usr, password: user.pw };
        fetch('api/auth/signin', {
            method: 'POST', 
            mode: 'cors',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(params)
        })
        .then(response => response.json())
        .then(data => {
            if (data.accessToken) {
                localStorage.token = data.accessToken;
                localStorage.isAuthenticated = true;
                window.location.reload();
            } else {
                this.setState({
                    errors: data.message
                });
            }
        })
        .catch(err => {
            console.log("Sign in data submit error: ", err);
        });
    }

    validateForm(event) {
        event.preventDefault();
        var user;
        if (this.state.signup === true) {
            var payload = validateSignUpForm(this.state.user);
            if (payload.success) {
                this.setState({
                    errors: {}
                });
                user = {
                    usr: this.state.user.username,
                    pw: this.state.user.password,
                    email: this.state.user.email
                };
                this.submitSignup(user);
            } else {
                const errors = payload.errors;
                this.setState({
                    errors
                });
            }
        } else {
            user = {
                usr: this.state.user.username,
                pw: this.state.user.password
            }
            this.submitSignin(user)
        }
    }

    pwMask(event) {
        event.preventDefault();
        this.setState(state =>
            Object.assign({}, state, {
                type: this.state.type === "password" ? "input" : "password",
                btnTxt: this.state.btnTxt === "show" ? "hide" : "show"
            })
        );
    }

    switchForm = (event) => {
        event.preventDefault();
        this.setState(state =>
            Object.assign({}, state, {
                errors: {},
                user: {
                    username: "",
                    email: "",
                    password: "",
                    pwconfirm: ""
                },
                signup: !this.state.signup
            })
        );
    }

    render() {
        return (
            <div>
                {this.state.signup === true && (
                    <SignUpForm
                        onSubmit={this.validateForm}
                        onChange={this.handleChange}
                        onPwChange={this.pwHandleChange}
                        errors={this.state.errors}
                        user={this.state.user}
                        score={this.state.score}
                        btnTxt={this.state.btnTxt}
                        type={this.state.type}
                        pwMask={this.pwMask}
                        switchForm={this.switchForm}
                    />
                )}
                {this.state.signup === false && (
                    <SignInForm
                        onSubmit={this.validateForm}
                        onChange={this.handleChange}
                        onPwChange={this.pwHandleChange}
                        errors={this.state.errors}
                        user={this.state.user}
                        score={this.state.score}
                        btnTxt={this.state.btnTxt}
                        type={this.state.type}
                        pwMask={this.pwMask}
                        switchForm={this.switchForm}
                    />
                )}
            </div>
        );
    }
}

// module.exports = LoginContainer;
export default LoginContainer;