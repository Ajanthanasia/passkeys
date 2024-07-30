import React, { useCallback, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { storeUserData } from "../../services/storage";
import Webcam from "react-webcam";
function Facerecoganize() {
    const Facerecoganize_Login_Url = " http://localhost:4500/api/v1/login";
    const navigate = useNavigate(); 
    const [customError, setCustomError] = useState("");
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [error, setError] = useState("");

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        console.log(imageSrc);
        setImgSrc(imageSrc);
        uploadImage(imageSrc);
    }, [webcamRef]);

    const retake = () => {
        setImgSrc(null);
    };
    const uploadImage = async (imageSrc) => {
        try {
            const res = await axios.post(Facerecoganize_Login_Url, {
                image: imageSrc
            });
            // console.log('Success:', res.data);
            if (res.data.Type=="Success"){
                storeUserData(res.data)
                navigate("/dashboard");
            }
            else if(res.data.Type !="Success"){
                setError(res.data.msg)
              
            }  
        } catch (error) {
            setCustomError("Failed to upload the image. Please try again.");
            console.error("Upload image error: ", error);
        }
    };

    return (
        
        <div className="row mt-1">
            <code>{error}</code>
            <div className="container">
                {imgSrc ? (
                    <img src={imgSrc} alt="webcam" />
                ) : (
                    <Webcam height={300} width={300} ref={webcamRef} />
                )}
                <div className="btn-container">
                    <button className="btn btn-success form-control" onClick={capture}>Capture photo</button>
                </div>
                <div className="row mt-1">
                    <div className="col-md-8">
                        <Link to="/">
                            <button className="btn btn-success form-control">
                                Login By Email
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Facerecoganize;