import React, { useState } from "react";
import {Navigate, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ShowSuccessMessage from './../alert/show-success-message';
import ShowWarningMessage from "../alert/show-warning-message";
import { storeUserData } from "../../services/storage";

function LoginPage() {
    const navigate = useNavigate(); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");

    const signinUrl = "http://localhost:4500/api/v1/login";

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setEmailError("");
            setPasswordError("");
            setError("error");
            if (email === "") {
                setEmailError("This field is required!");
            }
            if (password === "") {
                setPasswordError("This field is required!");
            }
            if (email && password) {
                const res = await axios.post(`${signinUrl}`, {
                    email: email,
                    password: password,
                });
                if (res.data.Type=="Success"){
                    storeUserData(res.data)
                    // console.log(res)
                    navigate("/dashboard");
                }
                else if(res.data.Type !="Success"){
                    setError(res.data.msg)
                  
                }  
            }
        } catch (error) {
            console.log(error);
            setError(error)
        }
    }
    return (
        <div className="panel panel-default">
            <div className="row">
                <div className="col-md-8">
                    <span className="btn btn-default form-control">Welcome to Passkeys</span>
                </div>
            </div>
            <ShowSuccessMessage msg={msg} />
            <ShowWarningMessage msg={error} />
            <form onSubmit={handleSubmit}>
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
                            type="password"
                            className="form-control"
                            placeholder="Enter your password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <code>{passwordError}</code>
                        

                    </div>
                </div>
                <div className="row mt-1">
                    <div className="col-md-8">
                        <button type="submit" className="btn btn-primary form-control">
                            Login
                        </button>
                    </div>
                </div>
            </form>
            <div className="row mt-1">
                <div className="col-md-8">
                    <Link to="/register">
                        <button className="btn btn-success form-control">
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;