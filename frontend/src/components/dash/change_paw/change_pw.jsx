import React, { useCallback, useRef, useState } from "react";
import Aside from "../aside";
import { getUserData, storeUserData ,RemoveUserData} from "../../../services/storage";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Webcam from "react-webcam";
// import "./otp.css";

export default function Change_PW() {
    const Facerecoganize_verify_Url = "http://localhost:4500/api/v1/varify_face_id/";
    const UpdateChagePassword = "http://localhost:4500/api/v1/UpdateChagePassword/";
    const userdetails = getUserData();
    const navigate = useNavigate();

    const [password, setPassword] = useState(userdetails.password);
    const [ConfirmPassword, setConfirmPassword] = useState(userdetails.ConfirmPassword);
    const [newPassword, setNewPassword] = useState(userdetails.newPassword);
    
    const webcamRef = useRef(null);

    const [passwordError, setPasswordError] = useState("");
    const [ConfirmPasswordError, setConfirmPasswordError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [customError, setCustomError] = useState("");
    const [inputs,setInputs]=useState(userdetails)

    const [showFacePopup,setShowFacePopup]=useState(false);
    const [imgSrc, setImgSrc] = useState(null);
    const [isFaceVerified, setIsFaceVerified] = useState(false);

    const [updateClick,setUpdateClick]=useState(false);
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setUpdateClick(true)
        // console.log(password)
        // console.log(ConfirmPassword)
        // console.log(newPassword)
        try {
            setNewPasswordError("");
            setConfirmPasswordError("");
            setPasswordError("");
            setCustomError("")

            if (!password) {
                console.log("here pass null")
                setPasswordError("This field is required");
                setUpdateClick(false)
            }
            if (!newPassword) {
                setUpdateClick(false)
                setNewPasswordError("This field is required");
            }
            if (!ConfirmPassword) {
                setUpdateClick(false)
                setConfirmPasswordError("This field is required");
            }
            if (password && newPassword && ConfirmPassword) {
                setUpdateClick(true)
                console.log("here")
                setShowFacePopup(true);
                setImgSrc(null);                
            }

        } catch (error) {
            setUpdateClick(false)
            setCustomError(error.message || "An unexpected error occurred.");
           
        }
    }

 

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        uploadImage(imageSrc);
    }, [webcamRef]);

    const retake = () => {
        setImgSrc(null);
    };

    const uploadImage = async (imageSrc) => {
        try {
            const res = await axios.post(`${Facerecoganize_verify_Url}${userdetails.id}`, { image: imageSrc });
            if (res.data.Type === "Success") {
                setIsFaceVerified(true);
                // console.log("here face")
                if(isFaceVerified==true){
                    console.log(password);
                    console.log(newPassword);
                    console.log(ConfirmPassword);
                    // console.log("here ok face verified--------")
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
            
            if(newPassword ==ConfirmPassword){
                // console.log("hereeeee ",newPassword ==ConfirmPassword)
                const res = await axios.post(`${UpdateChagePassword}${userdetails.id}`, {
                    password: password,
                    newPassword: newPassword,
                    ConfirmPassword: ConfirmPassword,
                });
                console.log(res)
                if (res.data.Type == "Success") {
                    setUpdateClick(true)
                    // console.log("ok success openp info")
                        setUpdateClick(true);
                            
                        setShowFacePopup(false);
                        RemoveUserData();
                        return navigate("/");

                            
                            
                }
                else if (res.data.Type != "Success") {
                    // console.log(res)
                            setUpdateClick(false)
                            setCustomError(res.data.msg)
                }
            }  
            else{
                // console.log(res)
                setCustomError("password not match")
            }          
        }

    const [passwordStrength, setPasswordStrength] = useState("");
    const [passwordStrength_newPassword, setPasswordStrength_newPassword] = useState("");
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
    const handlePasswordChange_newPassword = (e) => {
        const newPassword = e.target.value;
        setNewPassword(newPassword);
        setPasswordStrength_newPassword(checkPasswordStrength(newPassword));
    };
    
    const handlePasswordChange_confirmPassword = (e) => {
        const new_Confirm_Password = e.target.value;
        setConfirmPassword(new_Confirm_Password);
        setPasswordStrength_confirmPassword(checkPasswordStrength(new_Confirm_Password));
    };

    return(<>
    <div className="row mt-1">
            <div className="col-md-3">
                <Aside />
            </div>
            <div className="col-md-9">
                <div className="row">
                    <div className="col-md-12">
                        <div className="panel">
                            <div className="panel-default">
                                <form onSubmit={handleSubmit}>
                
            
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
                                            <b><label>New Password</label></b>
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Enter your New password..."
                                                value={newPassword}
                                                // onChange={(e) => setPassword(e.target.value)}
                                                onChange={handlePasswordChange_newPassword}
                                            />
                                            <p  style={{ 
                                                    margin: 0, 
                                                    color: passwordStrength_newPassword === 'Strong Password' ? 'green' : 'red',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {passwordStrength_newPassword}
                                            </p>
                                            <code>{newPasswordError}</code>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-8">
                                            <b><label>Confirm Password</label></b>
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Confirm your confirm password..."
                                                value={ConfirmPassword}
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
                                            <code>{ConfirmPasswordError}</code>
                                            <code>{customError}</code>
                                            <br />
                                            {/* <code>{imgsrcError}</code> */}
                                        </div>
                                    </div>
                                    <div className="row mt-1">
                                        <div className="col-md-8">
                                        <button
                                            className='btn btn-primary form-control'

                                            disabled={updateClick}
                                        >
                                            Click for Change Password
                                        </button>
                        
                                        </div>
                                    </div>

                                </form>
            
                                {showFacePopup && (
                                    <div className="otp-popup">
                                        <div className="otp-popup-content">
                                            {/* <code>{error}</code> */}
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    </>)
}
