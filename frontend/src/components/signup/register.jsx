import React, { useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./otp.css";
import Webcam from "react-webcam";

function RegisterPage() {
    const signupUrl = "http://localhost:4500/api/v1/register";
    const verifyOtpUrl = "http://localhost:4500/api/v1/otp";

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
    const [customError, setCustomError] = useState("");
    const [imgsrcError,setImgsrcError]=useState("")

    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [signupClick,setSignupClick]=useState(false);

    // Face recognition popup state
    const [showFacePopup, setShowFacePopup] = useState(false);
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [error, setError] = useState("");

        
    const [passwordStrength, setPasswordStrength] = useState("");
    const [passwordStrength_confirmPassword, setPasswordStrength_confirmPassword] = useState("");

    const checkPasswordStrength = (password) => {
        if (password.length <= 4) {
            return "Weak Password";
        } else if (password.length < 8) {
            return "Medium Password";
        } else {
            const hasUpperCase = /[A-Z]/.test(password);
            const hasNumber = /\d/.test(password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

            if (hasUpperCase && hasNumber && hasSpecialChar) {
                return "Strong Password";
            } else {
                return "Medium Password";
            }
        }
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(checkPasswordStrength(newPassword));
    };
    
    const handlePasswordChange_confirmPassword = (e) => {
        const new_Confirm_Password = e.target.value;
        setConfirmPassword(new_Confirm_Password);
        setPasswordStrength_confirmPassword(checkPasswordStrength(new_Confirm_Password));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Clear previous errors
        setUsernameError("");
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");
        setCustomError("");
        setImgsrcError("");

        // Basic form validation
        if (username === "") setUsernameError("This field is required");
        if (email === "") setEmailError("This field is required");
        if (password === "") setPasswordError("This field is required");
        if (confirmPassword === "") setConfirmPasswordError("This field is required");
        if (imgSrc===null) setImgsrcError("Register your face id");
        if (username && email && password && confirmPassword && imgSrc) {
            setSignupClick(true)
            if (password !== confirmPassword) {
                setSignupClick(false)
                setConfirmPasswordError("Passwords do not match");
            } else {
                console.log(imgSrc)
                try {
                    const res = await axios.post(signupUrl, {
                        username: username,
                        email: email,
                        password: password,
                        confirm_Password: confirmPassword,
                        image: imgSrc,
                    });
                    if (res.data.Type === "Success") {
                        setSignupClick(true)
                        setRegistrationSuccess(true);
                        setShowOtpPopup(true);
                        setRegisterButtonClass("disabled");
                    } else {
                        setSignupClick(false)
                        setCustomError(res.data.msg);
                        setImgSrc(null);
                    }
                } catch (error) {
                    setSignupClick(false)
                    setCustomError("An error occurred during registration");
                    console.error("Error during registration:", error);
                }
            }
        }
    };

    const handleOtpSubmit = async (event) => {
        event.preventDefault();
        setOtpError("");

        if (otp === "") {
            setOtpError("This field is required");
        } else {
            try {
                const res = await axios.post(verifyOtpUrl, {
                    email: email,
                    otp: otp,
                });
                if (res.data.Type === "Success") {
                    setShowOtpPopup(false);
                    navigate("/");
                } else {
                    setOtpError("Invalid OTP");
                }
            } catch (error) {
                console.error("Error verifying OTP:", error);
            }
        }
    };

    const showFacePopupHandler = (e) => {
        e.preventDefault();
        setShowFacePopup(true);
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
    }, [webcamRef]);

    const retake = () => {
        setImgSrc(null);
    };

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
                        <b><label>Name</label></b>
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
                        <b><label>Email</label></b>
                        <input
                            type="email"
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
                        <b><label>Password</label></b>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your password..."
                            value={password}
                            // onChange={(e) => setPassword(e.target.value)}
                            onChange={handlePasswordChange}
                        />
                        <p  style={{ 
                                margin: 0, 
                                color: passwordStrength === 'Strong Password' ? 'green' : 'red',
                                fontWeight: 'bold'
                            }}
                        >
                            {passwordStrength}
                        </p>
                        <code>{passwordError}</code>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <b><label>Confirm Password</label></b>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm your password..."
                            value={confirmPassword}
                            // onChange={(e) => setConfirmPassword(e.target.value)}
                            onChange={handlePasswordChange_confirmPassword}
                        />
                        <p style={{ 
                                margin: 0, 
                                color: passwordStrength_confirmPassword === 'Strong Password' ? 'green' : 'red',
                                fontWeight: 'bold'
                        }}>
                            {passwordStrength_confirmPassword}
                        </p>
                        <code>{confirmPasswordError}</code>
                        <code>{customError}</code>
                        <br />
                        <code>{imgsrcError}</code>
                    </div>
                </div>
                <div className="row mt-1">
                    <div className="col-md-8">
                <button
                    className={`btn btn-primary form-control ${registerButtonClass}`}
                    onClick={showFacePopupHandler}
                    disabled={signupClick}
                >
                    Click for face recognition
                </button>
                
                </div>
                </div>

                <div className="row mt-1">
                    <div className="col-md-8">
                        <button type="submit" className={`btn btn-primary form-control ${registerButtonClass}`}
                        disabled={signupClick}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </form>
            <div className="row mt-1">
                <div className="col-md-8">
                    <Link to="/">
                        <button className="btn btn-secondary form-control"
                        disabled={signupClick}>
                            Login
                        </button>
                    </Link>
                </div>
            </div>

            {showFacePopup && (
                <div className="otp-popup">
                    <div className="otp-popup-content">
                        <code>{error}</code>
                        {imgSrc ? (
                            <img src={imgSrc} alt="webcam" />
                        ) : (
                            <Webcam height={300} width={200} ref={webcamRef} />
                        )}
                        <div className="row mt-1">
                            <div className="col-md-8">
                                {imgSrc ? (
                                    <button className="btn btn-success form-control" onClick={retake}>
                                        Retake
                                    </button>
                                ) : (
                                    <button className="btn btn-success form-control" onClick={capture}>
                                        Register your face
                                    </button>
                                )}
                                <button className="btn btn-primary form-control" onClick={() => setShowFacePopup(false)}>
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showOtpPopup && (
                <div className="otp-popup">
                    <div className="otp-popup-content">
                        <form onSubmit={handleOtpSubmit}>
                            <div className="row">
                                <div className="col-md-8">
                                    <b><label>Enter OTP</label></b>
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
