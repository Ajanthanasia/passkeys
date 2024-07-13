import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const signupUrl = "#";


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setUsernameError("");
            setEmailError("");
            setPasswordError("");
            setConfirmPasswordError("");
            if (username === "") {
                setUsernameError("This field is required");
            }
            if (email === "") {
                setEmailError("This field is required");
            }
            if (password === "") {
                setPasswordError("This field is required");
            }
            if (confirmPassword === "") {
                setConfirmPasswordError("This field is required");
            }
            if (username && email && password && confirmPassword) {
                if (password !== confirmPassword) {
                    setConfirmPasswordError("Passwords does not matched");
                } else {
                    const res = await axios.post(`${signupUrl}`, {
                        username: username,
                        email: email,
                        password: password,
                        confirm_password: confirmPassword,
                    });
                    console.log(res);
                    console.log('succ');
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="panel panel-default">
            <div className="row">
                <div className="col-md-8">
                    <span className="btn btn-default form-control">Register your account</span>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-8">
                        <b><label htmlFor="">Name</label></b>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your username..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <code>{usernameError}</code>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <b><label htmlFor="">Email</label></b>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your email..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <code>{emailError}</code>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <b><label htmlFor="">Password</label></b>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <code>{passwordError}</code>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <b><label htmlFor="">Confirm Password</label></b>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Confirm your password..."
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <code>{confirmPasswordError}</code>
                    </div>
                </div>
                <div className="row mt-1">
                    <div className="col-md-8">
                        <button type="submit" className="btn btn-primary form-control">
                            Sign Up
                        </button>
                    </div>
                </div>
            </form>
            <div className="row mt-1">
                <div className="col-md-8">
                    <Link to="/">
                        <button className="btn btn-secondary form-control">
                            Login
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;