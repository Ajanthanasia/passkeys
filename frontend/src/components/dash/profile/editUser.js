import React, { useEffect, useRef, useState } from "react";
import Aside from "../aside";
import { getUserData, storeUserData ,RemoveUserData} from "../../../services/storage";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Webcam from "react-webcam";
import "./otp.css";


function EditUser() {
    
    const userdetails = getUserData();
    const navigate = useNavigate();
    const [username, setUsername] = useState(userdetails.name);
    const [email, setemail] = useState(userdetails.email);
    const [registerButtonClass, setRegisterButtonClass] = useState("");
    const webcamRef = useRef(null);

    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [customError, setCustomError] = useState("");
    const [inputs,setInputs]=useState(userdetails)

    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");
    const [showOtpPopup, setShowOtpPopup] = useState(false);

    const [showFacePopup,setShowFacePopup]=useState(false);
    const [imgSrc, setImgSrc] = useState(null);
    const [isFaceVerified, setIsFaceVerified] = useState(false);

    const [updateClick,setUpdateClick]=useState(false);
    
    const updateURL = "http://localhost:4500/api/v1/Update_userDetails";
    const Facerecoganize_verify_Url = "http://localhost:4500/api/v1/varify_face_id/";
    const updateWith_emailURL="http://localhost:4500/api/v1/Update_userDetails_email/";
    const verifyOtp_update_Url = "http://localhost:4500/api/v1/otp_update";
    const handleSubmit = async (event) => {
        setUpdateClick(true)
        event.preventDefault();
        try {
            setUsernameError("");
            setCustomError("");

            if (username === "") {
                setUsernameError("This field is required");
                setUpdateClick(false)
            }
            if (email === "") {
                setUpdateClick(false)
                setemail("This field is required");
            }
            if (username && email) {
                setUpdateClick(true)
                setShowFacePopup(true);
                setImgSrc(null);                
            }

        } catch (error) {
            setUpdateClick(false)
            setCustomError(error)
            console.log(error);
        }
    }
    const capture =  () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        uploadImage(imageSrc);
    };
    const retake = () => {
        setImgSrc(null);
        setCustomError("");
    };
    const uploadImage = async (imageSrc) => {
        try {
            const res = await axios.post(`${Facerecoganize_verify_Url}${userdetails.id}`, { image: imageSrc });
            if (res.data.Type === "Success") {
                
                setIsFaceVerified(true);
                if(isFaceVerified==true){
                    console.log("here ok face verified--------")
                    setUpdateClick(true)
                    handleSubmit_userDetails();
                    setShowFacePopup(false);
                }
                else{
                    setUpdateClick(false)
                    setShowFacePopup(false);
                }
                
            } else {
                
                setUpdateClick(false)
                setCustomError(res.data.msg);
            }
        } catch (error) {
            setUpdateClick(false)
            setCustomError("Failed to upload the image. Please try again.");
        }
    };
    const handleSubmit_userDetails = async () =>
    {
        setUpdateClick(true)
        console.log(username)
        console.log(email !=userdetails.email,'------1-----')
        if(email !=userdetails.email){
            console.log(userdetails.id)
            const res = await axios.post(`${updateWith_emailURL}${userdetails.id}`, {
                username: username,
                email: email,
            });
            if (res.data.Type == "Success") {
                setUpdateClick(true)
                console.log("ok success open otp info")
                        
                        // RemoveUserData();
                        setUpdateClick(true);
                        setShowOtpPopup(true);
                        setShowFacePopup(false);
                        
                        
                    }
                    else if (res.data.Type != "Success") {
                        setUpdateClick(false)
                        console.log("not ok")
                        setCustomError(res.data.msg)
                    }
        }
        else{
            console.log("=   ",username);
            const res = await axios.post(`${updateURL}`, {
                username: username,
                email: userdetails.email,
            });
            if (res.data.Type == "Success") {
                    setUpdateClick(false)
                        RemoveUserData();
                        storeUserData(res.data)
                        navigate("/dashboard");
                        
                    }
                    else if (res.data.Type != "Success") {
                        setUpdateClick(false)
                        setCustomError(res.data.msg)
                    }
                }
        
    }
    const handleOtpSubmit = async (event) => {
        event.preventDefault();
        setOtpError("");
        setUpdateClick(true)
        if (otp === "") {
            setOtpError("This field is required");
        } else {
            try {
                const res = await axios.post(verifyOtp_update_Url, {
                    
                    email: email,
                    otp: otp,
                });
                if (res.data.Type === "Success") {
                    setUpdateClick(false)
                    RemoveUserData();
                    storeUserData(res.data);
                    setShowOtpPopup(false);
                    setUpdateClick(false)
                    navigate("/dashboard");
                } else {
                    setUpdateClick(false)
                    setOtpError("Invalid OTP");
                }
            } catch (error) {
                setUpdateClick(false)
                console.error("Error verifying OTP:", error);
            }
        }
    };

    return (
        <div className="row mt-1">
            <div className="col-md-3">
                <Aside />
            </div>
            <div className="col-md-9">
                <div className="row">
                    <div className="col-md-12">
                        <div className="panel">
                            <div className="panel-default">
                                <h3>Update your account </h3>
                            </div>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-12">
                            <b><label htmlFor="">Name</label></b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your username..."
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <code>{usernameError}</code>
                            {/* <code>{customError}</code> */}
                        </div>
                        <div className="col-md-12">
                            <b><label htmlFor="">Email</label></b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your email..."
                                value={email}
                                onChange={(e) => setemail(e.target.value)}
                            />
                            <code>{emailError}</code>
                            <code>{customError}</code>
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-md-12">
                            <button type="submit" className='btn btn-primary form-control'
                            disabled= {updateClick}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </form>
                <div className="row">
                    <div className="col-md-12">
                        <Link to="/profile">
                            <button className="btn btn-secondary form-control">
                                back
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            {showOtpPopup && (
                <div className="otp-popup">
                    <div className="otp-popup-content">
                        <form onSubmit={handleOtpSubmit} >
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
            {showFacePopup && (
                        <div className="otp-popup">
                            <div className="otp-popup-content">
                                <code>{customError}</code>
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
                                                Verify your face ID
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

export default EditUser;