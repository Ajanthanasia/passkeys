import React, { useState , useCallback, useRef }from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ShowSuccessMessage from './../alert/show-success-message';
import ShowWarningMessage from "../alert/show-warning-message";
import { storeUserData } from "../../services/storage";

import Webcam from "react-webcam";

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    // for face rcoganition
    const [showFacePopup, setShowFacePopup] = useState(false);
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);

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
                    image: imgSrc,
                });
                if (res.data.Type == "Success") {
                    storeUserData(res.data)
                    // console.log(res)
                    navigate("/dashboard");
                }
                else if (res.data.Type != "Success") {
                    setError(res.data.msg)
                    setImgSrc(null);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
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
                    <span className="btn btn-default form-control">Welcome to Passkeys</span>
                </div>
            </div>
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
                        <button
                            className="btn btn-primary form-control"
                            onClick={showFacePopupHandler}
                        >
                            Click for Login the face Id
                        </button>
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
                                        Login your face
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
        </div>
    );
}

export default LoginPage;