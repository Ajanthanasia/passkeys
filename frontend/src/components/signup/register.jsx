import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import './otp.css'
function RegisterPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [registerButtonClass, setRegisterButtonClass] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [customError,setCustomError]=useState("");

    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);


    const signupUrl = "http://localhost:4500/api/v1/register";
    const verifyOtpUrl = " http://localhost:4500/api/v1/otp"

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            setUsernameError("");
            setEmailError("");
            setPasswordError("");
            setConfirmPasswordError("");
            setCustomError("");

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
                        confirm_Password: confirmPassword,
                    });
                    if (res.data.Type=="Success"){
                        setRegistrationSuccess(true);
                        setShowOtpPopup(true);
                        setRegisterButtonClass("disabled");
                        
                    }
                    else if(res.data.Type !="Success"){
                        setCustomError(res.data.msg)
                    }                    
                }
            }
        } catch (error) {
            setCustomError(error)
            console.log(error);
        }
    }

    const handleOtpSubmit = async (event) => {
        event.preventDefault();
        try {
            setOtpError("");
            if (otp === "") {
                setOtpError("This field is required");
            } else {
                const res = await axios.post(`${verifyOtpUrl}`, {
                    email: email,
                    otp: otp,
                });
                if (res.data.Type=="Success") {
                    setShowOtpPopup(false);
                    // alert('Registration and OTP verification successful!');
                    navigate("/");
                    // return < Navigate to="/" />

                } else {
                    setOtpError("Invalid OTP");
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
                        <code>{customError}</code>

                    </div>
                </div>
                <div className="row mt-1">
                    <div className="col-md-8">
                        <button type="submit"  className={`btn btn-primary form-control ${registerButtonClass}`}>
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
            {showOtpPopup && (
                <div className="otp-popup">
                    <div className="otp-popup-content">
                        <form onSubmit={handleOtpSubmit}>
                            <div className="row">
                                <div className="col-md-8">
                                    <b><label htmlFor="">Enter OTP</label></b>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter the OTP..."
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                    <code>{otpError}</code>
                                </div>
                            </div>
                            <div className="row mt-1">
                                <div className="col-md-8">
                                    <button type="submit" className="btn btn-primary form-control">
                                        Verify OTP
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
        
    );
}

export default RegisterPage;